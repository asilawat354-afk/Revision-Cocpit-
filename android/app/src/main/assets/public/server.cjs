var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "5mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var geminiClient = null;
function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});
async function generateGeminiContentWithFallback(ai, prompt, systemPrompt) {
  const modelsToTry = ["gemini-3.1-pro-preview", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError = null;
  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3
            // Lower temperature to prevent hallucination or irrelevant answers
          }
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");
        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }
        break;
      }
    }
  }
  throw lastError || new Error("Gemini AI \u0938\u0947\u0935\u093E \u0905\u0938\u094D\u0925\u093E\u092F\u0940 \u0930\u0942\u092A \u0938\u0947 \u0905\u0928\u0941\u092A\u0932\u092C\u094D\u0927 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0915\u0941\u091B \u092A\u0932\u094B\u0902 \u092C\u093E\u0926 \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964");
}
app.post("/api/gemini/doubt", async (req, res) => {
  try {
    const { questionQuery, subject, chapter, lecture, contextType } = req.body;
    if (!questionQuery) {
      return res.status(400).json({ error: "questionQuery is required" });
    }
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured in environment."
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
\u2022 \u{1F4A1} **\u0938\u091F\u0940\u0915 \u0938\u0902\u0915\u0932\u094D\u092A\u0928\u093E (Concept & Formula)**: \u092E\u0942\u0932 \u0928\u093F\u092F\u092E \u092F\u093E \u092B\u0949\u0930\u094D\u092E\u0942\u0932\u093E \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0942\u092A \u0938\u0947\u0964
\u2022 \u26A1 **\u090F\u0917\u094D\u091C\u093E\u092E \u0936\u0949\u0930\u094D\u091F\u0915\u091F (Speed Method / Trick)**: \u0930\u0947\u0936\u093F\u092F\u094B, \u0921\u093F\u091C\u093F\u091F\u0932 \u0938\u092E \u092F\u093E \u0935\u093F\u0915\u0932\u094D\u092A \u0939\u091F\u093E\u0928\u0947 \u0915\u093E \u0924\u0947\u091C\u093C \u0924\u0930\u0940\u0915\u093E\u0964
\u2022 \u{1F4DD} **\u0909\u0926\u093E\u0939\u0930\u0923 \u0938\u0939\u093F\u0924 \u0939\u0932 (Step-by-Step Explanation)**: \u091A\u0930\u0923\u092C\u0926\u094D\u0927 \u0938\u091F\u0940\u0915 \u0939\u0932\u0964
\u2022 \u26A0\uFE0F **\u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0938\u093E\u0935\u0927\u093E\u0928\u093F\u092F\u093E\u0902 (Common Traps & Mistakes)**: \u091B\u093E\u0924\u094D\u0930 \u0915\u0939\u093E\u0901 \u0917\u0932\u0924\u0940 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964`;
    const answer = await generateGeminiContentWithFallback(ai, questionQuery, systemPrompt);
    return res.json({
      answer: answer || "\u0909\u0924\u094D\u0924\u0930 \u0909\u0924\u094D\u092A\u0928\u094D\u0928 \u0928\u0939\u0940\u0902 \u0939\u094B \u0938\u0915\u093E\u0964 \u0915\u0943\u092A\u092F\u093E \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964"
    });
  } catch (error) {
    const rawMsg = error?.message || String(error);
    console.warn("Gemini API request note:", rawMsg.slice(0, 120));
    let friendlyMsg = "AI \u0938\u0930\u094D\u0935\u0930 \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0941\u0908\u0964 \u0915\u0943\u092A\u092F\u093E \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964";
    if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
      friendlyMsg = "\u092E\u0949\u0921\u0932 \u092A\u0930 \u0907\u0938 \u0938\u092E\u092F \u0905\u0924\u094D\u092F\u0927\u093F\u0915 \u091F\u094D\u0930\u0948\u092B\u093C\u093F\u0915 \u0939\u0948 (503 High Demand)\u0964 \u0938\u093F\u0938\u094D\u091F\u092E \u0928\u0947 \u0938\u094D\u0935\u0924\u0903 \u092C\u0948\u0915\u0911\u092B\u093C \u0915\u093F\u092F\u093E \u0939\u0948; \u0915\u0943\u092A\u092F\u093E 5-10 \u0938\u0947\u0915\u0902\u0921 \u092C\u093E\u0926 '\u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902' \u092A\u0930 \u0915\u094D\u0932\u093F\u0915 \u0915\u0930\u0947\u0902\u0964";
    } else if (rawMsg.includes("429") || rawMsg.includes("quota")) {
      friendlyMsg = "\u0926\u0948\u0928\u093F\u0915 \u0905\u0928\u0941\u0930\u094B\u0927 \u0938\u0940\u092E\u093E (Quota limit) \u092A\u093E\u0930 \u0939\u094B \u0917\u0908 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0915\u0941\u091B \u0938\u092E\u092F \u092C\u093E\u0926 \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964";
    } else if (rawMsg.includes("API key")) {
      friendlyMsg = "API Key \u0905\u092E\u093E\u0928\u094D\u092F \u092F\u093E \u0905\u0928\u0941\u092A\u0932\u092C\u094D\u0927 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E Settings \u092E\u0947\u0902 Gemini API Key \u0915\u0940 \u091C\u093E\u0902\u091A \u0915\u0930\u0947\u0902\u0964";
    }
    return res.status(500).json({
      error: friendlyMsg,
      details: rawMsg.slice(0, 200)
    });
  }
});
app.post("/api/gemini/daily-plan", async (req, res) => {
  try {
    const { dueTodayCount, focusSubjects, priorityChapter, examName, customGoals } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        plan: {
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          focusTheme: `\u0926\u0948\u0928\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F: ${dueTodayCount || 5} \u0930\u093F\u0935\u0940\u091C\u093C\u0928 \u0935 \u0917\u0939\u0928 \u0905\u092D\u094D\u092F\u093E\u0938`,
          morningBlock: `\u{1F305} \u0938\u0941\u092C\u0939 (8 AM - 11 AM): \u0906\u091C \u0915\u0947 \u0936\u0940\u0930\u094D\u0937 3 \u0932\u0947\u0915\u094D\u091A\u0930\u094D\u0938 \u0915\u093E 2-\u0938\u094D\u091F\u0947\u092A \u092B\u093E\u0909\u0902\u0921\u0947\u0936\u0928 \u0930\u093F\u0935\u0940\u091C\u093C\u0928 \u0914\u0930 \u090F\u0915\u094D\u091F\u093F\u0935 \u0930\u0940-\u0915\u0949\u0932\u0964`,
          afternoonBlock: `\u2600\uFE0F \u0926\u094B\u092A\u0939\u0930 (1 PM - 4 PM): ${focusSubjects?.join(", ") || "\u092E\u0941\u0916\u094D\u092F \u0935\u093F\u0937\u092F"} \u0915\u0947 25 \u092A\u093F\u091B\u0932\u0947 \u0935\u0930\u094D\u0937\u094B\u0902 \u0915\u0947 \u092A\u094D\u0930\u0936\u094D\u0928 (PYQ) \u0939\u0932 \u0915\u0930\u0947\u0902\u0964`,
          eveningBlock: `\u{1F319} \u0936\u093E\u092E (6 PM - 8 PM): \u0906\u091C \u0915\u0947 \u0936\u0947\u0937 \u0930\u093F\u0935\u0940\u091C\u093C\u0928, \u092B\u0949\u0930\u094D\u092E\u0942\u0932\u093E \u0936\u0940\u091F \u0905\u092A\u0921\u0947\u091F \u0914\u0930 \u092E\u0949\u0915 \u0915\u094D\u0935\u093F\u091C\u093C\u0964`,
          goldenTip: `\u2728 \u0938\u094D\u092A\u0940\u0921 \u092E\u0902\u0924\u094D\u0930: \u091C\u094B \u092A\u094D\u0930\u0936\u094D\u0928 \u0915\u0920\u093F\u0928 \u0932\u0917\u0947, \u0909\u0938\u0947 \u0924\u0941\u0930\u0902\u0924 AI \u0921\u093E\u0909\u091F \u0938\u0949\u0932\u094D\u0935\u0930 \u0938\u0947 \u0936\u0949\u0930\u094D\u091F \u091F\u094D\u0930\u093F\u0915 \u0938\u092E\u091D\u0947\u0902 \u0914\u0930 \u0928\u094B\u091F\u094D\u0938 \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u0947\u0902\u0964`
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
        focusTheme: `\u0926\u0948\u0928\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F: ${dueTodayCount || 5} \u0930\u093F\u0935\u0940\u091C\u093C\u0928 \u0935 \u0938\u091F\u0940\u0915 \u0905\u092D\u094D\u092F\u093E\u0938`,
        morningBlock: `\u{1F305} \u0938\u0941\u092C\u0939: \u0909\u091A\u094D\u091A \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0935\u093E\u0932\u0947 \u0932\u0947\u0915\u094D\u091A\u0930\u094D\u0938 \u0915\u093E \u090F\u0915\u094D\u091F\u093F\u0935 \u0930\u0940-\u0915\u0949\u0932\u0964`,
        afternoonBlock: `\u2600\uFE0F \u0926\u094B\u092A\u0939\u0930: \u092A\u094D\u0930\u0936\u094D\u0928\u094B\u0902 \u0915\u093E \u0905\u092D\u094D\u092F\u093E\u0938 \u0914\u0930 \u0915\u092E\u091C\u094B\u0930 \u091F\u0949\u092A\u093F\u0915\u094D\u0938 \u0915\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923\u0964`,
        eveningBlock: `\u{1F319} \u0936\u093E\u092E: \u0936\u0947\u0937 \u0915\u094B\u091F\u093E \u092A\u0942\u0930\u093E \u0915\u0930\u0928\u093E \u0914\u0930 \u0905\u0917\u0932\u0947 \u0926\u093F\u0928 \u0915\u0940 \u0924\u0948\u092F\u093E\u0930\u0940\u0964`,
        goldenTip: `\u2728 \u0932\u0917\u093E\u0924\u093E\u0930 \u0930\u093F\u0935\u0940\u091C\u093C\u0928 \u0939\u0940 \u0935\u093E\u0938\u094D\u0924\u0935\u093F\u0915 \u092E\u0939\u093E\u0930\u0924 (Mastery) \u0915\u0940 \u0915\u0941\u0902\u091C\u0940 \u0939\u0948\u0964`
      };
    }
    return res.json({
      plan: {
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        ...planData
      }
    });
  } catch (error) {
    console.warn("Daily plan fallback:", error?.message);
    return res.json({
      plan: {
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        focusTheme: "\u0906\u091C \u0915\u093E \u0938\u0902\u0924\u0941\u0932\u093F\u0924 \u0930\u093F\u0935\u0940\u091C\u093C\u0928 \u0935 \u092E\u0949\u0915 \u0905\u092D\u094D\u092F\u093E\u0938",
        morningBlock: "\u{1F305} \u0938\u0941\u092C\u0939: \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0935\u093E\u0932\u0947 \u0932\u0947\u0915\u094D\u091A\u0930\u094D\u0938 \u0915\u093E \u0917\u0939\u0928 \u0930\u093F\u0935\u0940\u091C\u093C\u0928\u0964",
        afternoonBlock: "\u2600\uFE0F \u0926\u094B\u092A\u0939\u0930: \u092A\u094D\u0930\u0948\u0915\u094D\u091F\u093F\u0938 \u0938\u0947\u091F \u0914\u0930 \u0938\u094D\u092A\u0940\u0921 \u091F\u0947\u0938\u094D\u091F\u0964",
        eveningBlock: "\u{1F319} \u0936\u093E\u092E: \u0921\u093E\u0909\u091F \u0915\u094D\u0932\u093F\u092F\u0930\u093F\u0902\u0917 \u0914\u0930 \u092B\u0949\u0930\u094D\u092E\u0942\u0932\u093E \u0930\u0940-\u0915\u0949\u0932\u0964",
        goldenTip: "\u2728 \u092F\u093E\u0926 \u0930\u0916\u0947\u0902: \u0930\u094B\u091C\u093C 20 \u0938\u0939\u0940 \u0938\u0935\u093E\u0932 \u092A\u0942\u0930\u0947 100 \u092A\u0928\u094D\u0928\u094B\u0902 \u0915\u0940 \u0925\u094D\u092F\u094B\u0930\u0940 \u0938\u0947 \u0905\u0927\u093F\u0915 \u092A\u0930\u093F\u0923\u093E\u092E \u0926\u0947\u0924\u0947 \u0939\u0948\u0902\u0964"
      }
    });
  }
});
app.get("/api/download-zip", async (_req, res) => {
  try {
    const archiverModule = await import("archiver");
    const archive = archiverModule.ZipArchive ? new archiverModule.ZipArchive({ zlib: { level: 9 } }) : (archiverModule.default || archiverModule)("zip", { zlib: { level: 9 } });
    res.setHeader("Content-Disposition", 'attachment; filename="smart-revision-cockpit-native-android.zip"');
    res.setHeader("Content-Type", "application/zip");
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error creating ZIP archive");
      }
    });
    archive.pipe(res);
    if (import_fs.default.existsSync(import_path.default.join(process.cwd(), "android"))) {
      archive.directory(import_path.default.join(process.cwd(), "android"), "android");
    }
    if (import_fs.default.existsSync(import_path.default.join(process.cwd(), "src"))) {
      archive.directory(import_path.default.join(process.cwd(), "src"), "src");
    }
    if (import_fs.default.existsSync(import_path.default.join(process.cwd(), "public"))) {
      archive.directory(import_path.default.join(process.cwd(), "public"), "public");
    }
    if (import_fs.default.existsSync(import_path.default.join(process.cwd(), "scripts"))) {
      archive.directory(import_path.default.join(process.cwd(), "scripts"), "scripts");
    }
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
      const filePath = import_path.default.join(process.cwd(), file);
      if (import_fs.default.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });
    await archive.finalize();
  } catch (error) {
    console.error("Failed to generate zip:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to generate archive: " + (error?.message || error));
    }
  }
});
app.get("/api/sheets/fetch", async (req, res) => {
  try {
    const sheetId = req.query.sheetId || "1j6yR4Hf6YxNSIgcOoNQqWKDYzPHHI0fTIIWykiXthkU";
    const gid = req.query.gid || "625661383";
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
  } catch (err) {
    console.error("Failed to fetch Google Sheet CSV:", err);
    res.status(500).json({ error: err.message || "Failed to fetch spreadsheet" });
  }
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production" || typeof __filename !== "undefined" && __filename.includes("dist") || typeof __dirname !== "undefined" && __dirname.includes("dist");
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
  server.on("error", (err) => {
    console.error("Server listen error:", err);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
