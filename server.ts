import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Enable CORS for Android Capacitor origins and mobile devices
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper to call Gemini with retry & fallback models for 503/429 high demand spikes
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemPrompt: string
): Promise<string> {
  // Use official, highly accurate models: gemini-3.1-pro-preview for deep STEM/reasoning, gemini-3.8-flash for fast accuracy
  const modelsToTry = ["gemini-3.1-pro-preview", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3, // Lower temperature to prevent hallucination or irrelevant answers
          },
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error("Gemini AI सेवा अस्थायी रूप से अनुपलब्ध है। कृपया कुछ पलों बाद पुनः प्रयास करें।");
}

// Gemini AI Doubt Explainer & Trick Advisor endpoint
app.post("/api/gemini/doubt", async (req, res) => {
  try {
    const { questionQuery, subject, chapter, lecture, contextType } = req.body;

    if (!questionQuery) {
      return res.status(400).json({ error: "questionQuery is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured in environment.",
      });
    }

    const systemPrompt = `You are a top-tier competitive exam mentor, subject master, and expert educator for exams like SSC CGL, UPSC, Banking, Railways, and State PSCs.
CRITICAL INSTRUCTIONS FOR ACCURACY AND QUALITY:
1. Always give precise, mathematically and conceptually accurate answers. Never hallucinate, guess, or provide off-topic generic replies.
2. Directly answer the user's specific question or topic without unnecessary preamble or irrelevant filler.
3. If the user mentions a specific math problem, show exact formula, step-by-step arithmetic without calculation errors, and verified speed tricks (Vedic math, Digital Sum, Ratio, Elimination).
4. Subject: ${subject || "General Aptitude"} | Chapter: ${chapter || "General"} | Lecture: ${lecture || "N/A"}.
5. Tone: Respectful, disciplined, highly encouraging, and strictly authentic in clear Hindi / Hinglish.

Structure your response clearly:
• 💡 **सटीक संकल्पना (Concept & Formula)**: मूल नियम या फॉर्मूला स्पष्ट रूप से।
• ⚡ **एग्जाम शॉर्टकट (Speed Method / Trick)**: रेशियो, डिजिटल सम या विकल्प हटाने का तेज़ तरीका।
• 📝 **उदाहरण सहित हल (Step-by-Step Explanation)**: चरणबद्ध सटीक हल।
• ⚠️ **परीक्षा में सावधानियां (Common Traps & Mistakes)**: छात्र कहाँ गलती करते हैं।`;

    const answer = await generateGeminiContentWithFallback(ai, questionQuery, systemPrompt);

    return res.json({
      answer: answer || "उत्तर उत्पन्न नहीं हो सका। कृपया पुनः प्रयास करें।",
    });
  } catch (error: any) {
    const rawMsg = error?.message || String(error);
    console.warn("Gemini API request note:", rawMsg.slice(0, 120));
    let friendlyMsg = "AI सर्वर से संपर्क करने में समस्या हुई। कृपया पुनः प्रयास करें।";

    if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
      friendlyMsg = "मॉडल पर इस समय अत्यधिक ट्रैफ़िक है (503 High Demand)। सिस्टम ने स्वतः बैकऑफ़ किया है; कृपया 5-10 सेकंड बाद 'पुनः प्रयास करें' पर क्लिक करें।";
    } else if (rawMsg.includes("429") || rawMsg.includes("quota")) {
      friendlyMsg = "दैनिक अनुरोध सीमा (Quota limit) पार हो गई है। कृपया कुछ समय बाद पुनः प्रयास करें।";
    } else if (rawMsg.includes("API key")) {
      friendlyMsg = "API Key अमान्य या अनुपलब्ध है। कृपया Settings में Gemini API Key की जांच करें।";
    }

    return res.status(500).json({
      error: friendlyMsg,
      details: rawMsg.slice(0, 200),
    });
  }
});

// Gemini AI Magical Day Plan Optimizer endpoint
app.post("/api/gemini/daily-plan", async (req, res) => {
  try {
    const { dueTodayCount, focusSubjects, priorityChapter, examName, customGoals } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Smart Fallback when API key is not available
      return res.json({
        plan: {
          date: new Date().toISOString().split("T")[0],
          focusTheme: `दैनिक लक्ष्य: ${dueTodayCount || 5} रिवीज़न व गहन अभ्यास`,
          morningBlock: `🌅 सुबह (8 AM - 11 AM): आज के शीर्ष 3 लेक्चर्स का 2-स्टेप फाउंडेशन रिवीज़न और एक्टिव री-कॉल।`,
          afternoonBlock: `☀️ दोपहर (1 PM - 4 PM): ${focusSubjects?.join(", ") || "मुख्य विषय"} के 25 पिछले वर्षों के प्रश्न (PYQ) हल करें।`,
          eveningBlock: `🌙 शाम (6 PM - 8 PM): आज के शेष रिवीज़न, फॉर्मूला शीट अपडेट और मॉक क्विज़।`,
          goldenTip: `✨ स्पीड मंत्र: जो प्रश्न कठिन लगे, उसे तुरंत AI डाउट सॉल्वर से शॉर्ट ट्रिक समझें और नोट्स में जोड़ें।`
        }
      });
    }

    const systemPrompt = `You are a legendary study strategist and mentor for Indian competitive exams.
Create a hyper-productive, realistic, highly motivating 1-day study blueprint in Hindi / Hinglish.
Return strictly valid JSON with these keys:
- focusTheme: short catchy headline (in Hindi)
- morningBlock: morning slot action (in Hindi)
- afternoonBlock: afternoon slot action (in Hindi)
- eveningBlock: evening slot action (in Hindi)
- goldenTip: 1 high-yield speed/memory trick (in Hindi)`;

    const userPrompt = `Student Context:
- Target Exam: ${examName || "UPSC / Govt Exams"}
- Revisions due today: ${dueTodayCount || 5} lectures
- Focus Subjects: ${Array.isArray(focusSubjects) ? focusSubjects.join(", ") : "All"}
- Priority Chapter: ${priorityChapter || "All"}
- Student custom goals: ${customGoals || "None"}

Generate an inspiring, structured 1-day action plan in JSON format.`;

    const rawResponse = await generateGeminiContentWithFallback(ai, userPrompt, systemPrompt);
    let planData;
    try {
      const cleanJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      planData = JSON.parse(cleanJson);
    } catch {
      planData = {
        focusTheme: `दैनिक लक्ष्य: ${dueTodayCount || 5} रिवीज़न व सटीक अभ्यास`,
        morningBlock: `🌅 सुबह: उच्च प्राथमिकता वाले लेक्चर्स का एक्टिव री-कॉल।`,
        afternoonBlock: `☀️ दोपहर: प्रश्नों का अभ्यास और कमजोर टॉपिक्स का विश्लेषण।`,
        eveningBlock: `🌙 शाम: शेष कोटा पूरा करना और अगले दिन की तैयारी।`,
        goldenTip: `✨ लगातार रिवीज़न ही वास्तविक महारत (Mastery) की कुंजी है।`
      };
    }

    return res.json({
      plan: {
        date: new Date().toISOString().split("T")[0],
        ...planData
      }
    });
  } catch (error: any) {
    console.warn("Daily plan fallback:", error?.message);
    return res.json({
      plan: {
        date: new Date().toISOString().split("T")[0],
        focusTheme: "आज का संतुलित रिवीज़न व मॉक अभ्यास",
        morningBlock: "🌅 सुबह: प्राथमिकता वाले लेक्चर्स का गहन रिवीज़न।",
        afternoonBlock: "☀️ दोपहर: प्रैक्टिस सेट और स्पीड टेस्ट।",
        eveningBlock: "🌙 शाम: डाउट क्लियरिंग और फॉर्मूला री-कॉल।",
        goldenTip: "✨ याद रखें: रोज़ 20 सही सवाल पूरे 100 पन्नों की थ्योरी से अधिक परिणाम देते हैं।"
      }
    });
  }
});

// Download full project ZIP file endpoint (including full Android Kotlin project & web app)
app.get("/api/download-zip", async (_req, res) => {
  try {
    const archiverModule: any = await import("archiver");
    const archive = archiverModule.ZipArchive
      ? new archiverModule.ZipArchive({ zlib: { level: 9 } })
      : (archiverModule.default || archiverModule)("zip", { zlib: { level: 9 } });

    res.setHeader("Content-Disposition", 'attachment; filename="smart-revision-cockpit-native-android.zip"');
    res.setHeader("Content-Type", "application/zip");

    archive.on("error", (err: any) => {
      console.error("Archive error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error creating ZIP archive");
      }
    });

    archive.pipe(res);

    // Add android directory
    if (fs.existsSync(path.join(process.cwd(), "android"))) {
      archive.directory(path.join(process.cwd(), "android"), "android");
    }

    // Add src directory
    if (fs.existsSync(path.join(process.cwd(), "src"))) {
      archive.directory(path.join(process.cwd(), "src"), "src");
    }

    // Add public directory
    if (fs.existsSync(path.join(process.cwd(), "public"))) {
      archive.directory(path.join(process.cwd(), "public"), "public");
    }

    // Add scripts directory
    if (fs.existsSync(path.join(process.cwd(), "scripts"))) {
      archive.directory(path.join(process.cwd(), "scripts"), "scripts");
    }

    // Add root config files
    const rootFiles = [
      "package.json",
      "tsconfig.json",
      "vite.config.ts",
      "index.html",
      "metadata.json",
      "server.ts",
      ".env.example",
      "firestore.rules",
      "firebase-blueprint.json",
      "firebase-applet-config.json",
      "bun.lock"
    ];

    rootFiles.forEach((file) => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });

    await archive.finalize();
  } catch (error: any) {
    console.error("Failed to generate zip:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to generate archive: " + (error?.message || error));
    }
  }
});

// Download complete standalone single-file HTML web app (All-in-One HTML + CSS + React JS + 1,289 Lectures DB)
app.get("/api/download-html", (_req, res) => {
  try {
    const singleHtmlPath = path.join(process.cwd(), "public", "Smart-Revision-Cockpit-Standalone-Web-App.html");
    const distSingleHtmlPath = path.join(process.cwd(), "dist-single", "index.html");
    const targetPath = fs.existsSync(singleHtmlPath)
      ? singleHtmlPath
      : fs.existsSync(distSingleHtmlPath)
      ? distSingleHtmlPath
      : path.join(process.cwd(), "index.html");

    res.setHeader("Content-Disposition", 'attachment; filename="Smart-Revision-Cockpit-Standalone-Web-App.html"');
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(targetPath);
  } catch (error: any) {
    console.error("Failed to serve standalone HTML:", error);
    res.status(500).send("Failed to download HTML file: " + (error?.message || error));
  }
});

// Google Sheets Integration API (Proxy to prevent CORS on Web & Android Capacitor)
app.get("/api/sheets/fetch", async (req, res) => {
  try {
    const sheetId = (req.query.sheetId as string) || "1j6yR4Hf6YxNSIgcOoNQqWKDYzPHHI0fTIIWykiXthkU";
    const gid = (req.query.gid as string) || "625661383"; // default Master Database
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `Google Sheets returned status ${response.status}` });
    }
    
    const csvText = await response.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csvText);
  } catch (err: any) {
    console.error("Failed to fetch Google Sheet CSV:", err);
    res.status(500).json({ error: err.message || "Failed to fetch spreadsheet" });
  }
});

// Vite Middleware for development / static files for production
async function startServer() {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (typeof __filename !== "undefined" && __filename.includes("dist")) ||
    (typeof __dirname !== "undefined" && __dirname.includes("dist"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("Server listen error:", err);
  });
}

startServer();
