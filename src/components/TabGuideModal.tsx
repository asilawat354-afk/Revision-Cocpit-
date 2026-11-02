import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Target, 
  Cpu, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Database, 
  CalendarDays, 
  Grid3X3, 
  ShieldCheck,
  Bot,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Check,
  Menu
} from "lucide-react";
import { ActiveTab } from "./Navbar";

interface TabGuideModalProps {
  isOpen: boolean;
  tabKey: ActiveTab | null;
  onClose: () => void;
  onSwitchTab?: (tab: ActiveTab) => void;
}

interface QuickQuestion {
  question: string;
  quickAnswer: string;
}

interface TabGuideData {
  title: string;
  subtitle: string;
  hindiBadge: string;
  icon: React.ReactNode;
  themeColor: string;
  accentBg: string;
  purpose: string;
  howItWorks: string[];
  keyFeatures: string[];
  smartInsights: string;
  possibleImprovements: string[];
  suggestedQuestions: QuickQuestion[];
}

const TAB_GUIDES: Record<ActiveTab, TabGuideData> = {
  home: {
    title: "होम पेज (My Personal Space)",
    subtitle: "100% कस्टमाइज़ेबल डैशबोर्ड • परीक्षा उलटी गिनती • नोट्स • दैनिक लक्ष्य",
    hindiBadge: "पर्सनल कमांड सेंटर",
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    themeColor: "amber",
    accentBg: "bg-amber-50 border-amber-200 text-amber-900",
    purpose: "विद्यार्थी को अपनी मर्जी और आवश्यकता के अनुसार एक व्यक्तिगत अध्ययन डैशबोर्ड तैयार करने की पूरी स्वतंत्रता देना ताकि वे जो चाहें वो रख सकें।",
    howItWorks: [
      "पूर्ण कस्टमाइज़ेबिलिटी: 'होम पेज कस्टमाइज़ करें' बटन से किसी भी कार्ड या विजेट को चालू/बंद करें।",
      "दैनिक लक्ष्य और चेकलिस्ट: अपने स्वयं के दैनिक अध्ययन कार्य जोड़ें और पूरा होने पर टिक करें।",
      "क्विक नोट्स व फॉर्मूला स्क्रैचपैड: फॉर्मूले, शॉर्ट ट्रिक्स और नोट्स लिखें जो स्वतः सुरक्षित रहते हैं।",
      "लक्ष्य परीक्षा उलटी गिनती: अपनी परीक्षा की तिथि सेट कर बचे हुए दिनों और सप्ताहों पर नज़र रखें।",
      "कस्टम कार्ड्स: अपनी पसंद के असीमित कस्टम कार्ड्स (विषय, लिंक्स, ट्रिक्स) बनाएं।"
    ],
    keyFeatures: [
      "🪄 जादुई AI दैनिक स्टडी प्लानर (1-क्लिक मॉर्निंग, दोपहर व शाम का शेड्यूल)",
      "🎯 लक्ष्य परीक्षा उलटी गिनती टाइमर (Live Days & Weeks Countdown)",
      "📝 व्यक्तिगत दैनिक चेकलिस्ट व माइक्रो-गोल्स",
      "💡 ऑटो-सेविंग फॉर्मूला व क्विक नोट्स स्क्रैचपैड",
      "📌 पसंदीदा फोकस विषयों को होम स्क्रीन पर पिन करना",
      "🗂️ असीमित कस्टम कार्ड्स क्रिएटर"
    ],
    smartInsights: "यह होम पेज आपके मानसिक फोकस को केंद्रित रखने और आपकी तैयारी को व्यक्तिगत दिशा देने के लिए बनाया गया है।",
    possibleImprovements: [
      "विजेट्स को ड्रैग और री-ऑर्डर करने की सुविधा",
      "थीम व डार्क/लाइट बैकग्राउंड कलर्स",
      "मॉक टेस्ट स्कोर ट्रैकर विजेट"
    ],
    suggestedQuestions: [
      {
        question: "होम पेज पर मैं क्या-क्या रख सकता हूँ?",
        quickAnswer: "आप 'होम पेज कस्टमाइज़ करें' बटन दबाकर परीक्षा उलटी गिनती, दैनिक चेकलिस्ट, क्विक नोट्स, पसंदीदा विषय, AI प्लान और अपने खुद के कस्टम कार्ड्स जोड़ या हटा सकते हैं।"
      },
      {
        question: "मेरे द्वारा लिखे गए नोट्स और कार्य कहाँ सेव होते हैं?",
        quickAnswer: "आपके सभी नोट्स, टास्क और कस्टम कार्ड्स ब्राउज़र के लोकल स्टोरेज और सुरक्षित क्लाउड डेटाबेस में ऑटो-सेव होते हैं।"
      }
    ]
  },
  cockpit: {
    title: "आज का रिवीज़न (Smart Revision Cockpit)",
    subtitle: "दैनिक प्राथमिक कार्यक्षेत्र • 2-Step Foundation + Spaced Repetition",
    hindiBadge: "दैनिक कोर इंजन",
    icon: <Compass className="w-5 h-5 text-amber-600" />,
    themeColor: "amber",
    accentBg: "bg-amber-50 border-amber-200 text-amber-900",
    purpose: "विद्यार्थी को पूरे दिन भर में सिर्फ उतना ही काम देना जितना वह वास्तव में कर सकता है। पुराने 400+ लेक्चर्स के मानसिक दबाव को शून्य करके आज के 10-15 प्राथमिक रिवीज़न पर 100% एकाग्रता बनाए रखना।",
    howItWorks: [
      "2-Step Foundation नियम: किसी भी नए लेक्चर को 24 घंटे (Day 1) और फिर 72 घंटे (Day 3) पर अनिवार्य रूप से रिवीज़न करवाता है ताकि विस्मरण वक्र (Ebbinghaus Forgetting Curve) को तोड़ा जा सके।",
      "Dynamic Daily Quota: यदि आज का कार्य कोटा (जैसे 10) से अधिक हो जाता है, तो अतिरिक्त लेक्चर्स पैनिक नहीं बनाते बल्कि संतुलित कतार में रहते हैं।",
      "One-Click Auto-Leveling (लोड बैलेंसर): एक क्लिक से आज के अतिरिक्त भार को आगामी 30 दिनों के सबसे हल्के दिनों में स्मार्टली पुनर्वितरित करता है।"
    ],
    keyFeatures: [
      "रिवीज़न टाइमर व कठिनाई रेटिंग (Easy, Medium, Hard)",
      "कठिनाई अनुसार आगामी अंतराल: Easy (+21 दिन), Medium (+12 दिन), Hard (+4 दिन)",
      "अध्यायों की विषयवार डायरेक्टरी (I3:J310 से 305 अध्याय)",
      "Gemini AI द्वारा तत्काल नोट्स सारांश व डाउट समाधान"
    ],
    smartInsights: "यह कॉकपिट छात्र को 'आज मुझे क्या पढ़ना है?' के मानसिक द्वंद्व से मुक्त रखता है। जो स्क्रीन पर दिखे, बस उसे पूरा करें।",
    possibleImprovements: [
      "पोमोडोरो 25-मिनट ऑडियो घंटी या ब्रेक रिमाइंडर जोड़ना।",
      "प्रत्येक विषय के लिए अलग-अलग दैनिक कोटा (जैसे 2 लेक्चर्स गणित, 2 इतिहास) सेट करने की सुविधा।",
      "रिवीज़न शुरू करने से पहले पिछले रिवीज़न के मुख्य नोट्स/गलतियाँ तुरंत पॉपअप में दिखाना।"
    ],
    suggestedQuestions: [
      {
        question: "अगर आज 15 में से सिर्फ 8 ही लेक्चर रिवीज़न हो पाएँ तो बाकी का क्या होगा?",
        quickAnswer: "चिंता की कोई बात नहीं! जो 7 लेक्चर बचेंगे वे अगले दिन के कोटा में सबसे ऊपर प्राथमिक रूप से रहेंगे। यदि बहुत ज्यादा लोड हो जाए, तो आप 'लोड संतुलित करें (Auto-Level)' बटन दबाकर उन्हें आगामी हल्के दिनों में फैला सकते हैं।"
      },
      {
        question: "Easy, Medium और Hard रेटिंग में से मुझे कौन सा चुनना चाहिए?",
        quickAnswer: "यदि लेक्चर के सभी फॉर्मूले और कॉन्सेप्ट तुरंत याद आ गए तो 'Easy' (+21 दिन) चुनें। यदि थोड़े हिंट या दोबारा पढ़ने की जरूरत पड़ी तो 'Medium' (+12 दिन) चुनें। और यदि भूल चुके थे या सवाल हल नहीं हुए तो 'Hard' (+4 दिन) चुनें।"
      },
      {
        question: "2-Step Foundation का वैज्ञानिक आधार क्या है?",
        quickAnswer: "वैज्ञानिक शोध (एबिंगहॉस कर्व) के अनुसार नया पढ़ा हुआ ज्ञान 72 घंटों में 75% गायब हो जाता है। 24 घंटे (Step 1) और 72 घंटे (Step 2) पर रिवीजन करने से न्यूरल पाथवे लॉक हो जाते हैं और वह स्थायी स्मृति बन जाता है।"
      },
      {
        question: "क्या मैं आज का दैनिक कोटा 10 से बदलकर 15 या 20 कर सकता हूँ?",
        quickAnswer: "हाँ! ऊपर नेविगेशन बार में दिए गए सेटिंग या डायरेक्टरी के पास से आप अपना दैनिक कोटा (Daily Quota) अपनी अध्ययन क्षमता अनुसार कभी भी कम या अधिक कर सकते हैं।"
      }
    ]
  },
  master_db: {
    title: "सभी लेक्चर्स (Master Database)",
    subtitle: "सम्पूर्ण अध्ययन सामग्री • बहुआयामी फ़िल्टर व त्वरित खोज",
    hindiBadge: "डेटा लाइब्रेरी",
    icon: <Database className="w-5 h-5 text-sky-600" />,
    themeColor: "sky",
    accentBg: "bg-sky-50 border-sky-200 text-sky-900",
    purpose: "पाठ्यक्रम के सभी 424+ लेक्चर्स की स्थिति, विषय, आगामी तारीख और प्रगति को एक ही तालिका में पारदर्शी रूप से देखना और प्रबंधित करना।",
    howItWorks: [
      "प्रत्येक लेक्चर का पूरा इतिहास: Step 1 (Day 1) पूरा हुआ या नहीं, Step 2 (Day 3) पूरा हुआ या नहीं, कुल रिवीज़न काउंट और अगली तारीख।",
      "फ़िल्टर और सर्च: विषय (Subject), अध्याय (Chapter), स्थिति (आज देय, आगामी, पूर्ण, बैकलॉग) के अनुसार सेकंडों में छाँटना।",
      "नया लेक्चर जोड़ना: सीधे 'नया लेक्चर जोड़ें' से Google Sheets रेंज के 305 अध्यायों में से चुनकर तुरंत जोड़ना।"
    ],
    keyFeatures: [
      "डायरेक्ट स्थिति बैज (Due Today, Tomorrow, Pending, Done)",
      "प्रत्येक पंक्ति में Gemini AI डाउट हेल्पर बटन",
      "अंतिम कठिनाई रेटिंग व रिवीज़न अंतराल की सीधी दृश्यता",
      "CSV व Google Sheets डेटा के अनुकूल संरचना"
    ],
    smartInsights: "मास्टर डेटाबेस आपकी अध्ययन यात्रा का ब्लैक बॉक्स रिकॉर्डर है। कोई भी लेक्चर कभी खोता नहीं है।",
    possibleImprovements: [
      "मल्टीपल लेक्चर्स को एक साथ टिक करके तारीख आगे खिसकाने (Bulk Shift) का विकल्प।",
      "रिवीज़न के व्यक्तिगत नोट्स सीधे डेटाबेस में इनलाइन एडिट करने की सुविधा।",
      "विषयवार पूर्णता प्रतिशत (Completion Bar) कॉलम जोड़ना।"
    ],
    suggestedQuestions: [
      {
        question: "क्या मैं किसी लेक्चर की अगली रिवीज़न तारीख सीधे यहाँ बदल सकता हूँ?",
        quickAnswer: "हाँ, डेटाबेस में हर लेक्चर का विवरण और आगामी तारीख दिखाई देती है। आप अपनी सुविधानुसार किसी भी लेक्चर की स्थिति की समीक्षा कर सकते हैं।"
      },
      {
        question: "यदि मुझे केवल 'गणित' (Maths) के पेंडिंग लेक्चर्स देखने हों तो कैसे देखें?",
        quickAnswer: "ऊपर दिए गए 'विषय' फ़िल्टर ड्रॉपडाउन से 'गणित' चुनें और स्थिति (Status) फ़िल्टर से 'लंबित (Pending)' चुनें। सिर्फ वही लेक्चर्स सेकंड भर में फ़िल्टर हो जाएँगे।"
      },
      {
        question: "गूगल शीट्स के 305 अध्यायों का क्या संबंध है?",
        quickAnswer: "आपकी शीट्स (I3:J310) के सभी 305 प्रामाणिक अध्याय (जैसे प्रतिशत, लाभ-हानि, त्रिकोणमिति) सिस्टम में इनबिल्ट हैं। जब भी आप नया लेक्चर जोड़ते हैं, स्पेलिंग की गलती के बिना सही अध्याय ऑटोमैटिक मैप होता है।"
      },
      {
        question: "प्रत्येक पंक्ति में 'AI डाउट' बटन क्या काम करता है?",
        quickAnswer: "उस बटन पर क्लिक करते ही Gemini AI उस अध्याय के लिए विशेष शॉर्टकट, डिजिटल सम ट्रिक और परीक्षा में पूछे गए कठिन सवालों के स्टेप-बाय-स्टेप हल तुरंत तैयार करके देता है।"
      }
    ]
  },
  heatmap: {
    title: "30-दिन कैलेंडर (Capacity Heatmap Forecast)",
    subtitle: "भविष्य का कार्यभार पूर्वानुमान • ओवरलोड की अग्रिम चेतावनी",
    hindiBadge: "स्मार्ट फोरकास्ट",
    icon: <CalendarDays className="w-5 h-5 text-indigo-600" />,
    themeColor: "indigo",
    accentBg: "bg-indigo-50 border-indigo-200 text-indigo-900",
    purpose: "आने वाले 30 दिनों में किस तारीख को कितने लेक्चर्स का रिवीज़न आने वाला है, इसका अग्रिम हीटमैप दिखाना ताकि अचानक किसी दिन 25 लेक्चर्स का पहाड़ न टूटे।",
    howItWorks: [
      "कलर कोडिंग सिस्टम: हरा (सुरक्षित / हल्का भार), पीला (संतुलित भार), लाल/गहरा नारंगी (क्षमता से अधिक भारी लोड)।",
      "दैनिक कोटा तुलना: आपके निर्धारित दैनिक कोटा (Daily Capacity) के आधार पर प्रत्येक दिन का लोड प्रतिशत गणना करता है।",
      "स्मार्ट ऑटो-लेवलिंग प्रिव्यू: ओवरलोड वाले दिनों को देखकर आप तुरंत 'ऑटो-लेवल' चला सकते हैं जो भीड़भाड़ वाले दिनों से लेक्चर्स को शांत दिनों में स्थानांतरित कर देता है।"
    ],
    keyFeatures: [
      "30-दिवसीय दैनिक बार चार्ट व हीटमैप टाइल्स",
      "अतिभार (Overloaded) दिनों की स्पष्ट चेतावनी",
      "किसी भी विशेष दिन पर क्लिक करके उस दिन के निर्धारित लेक्चर्स देखना",
      "परीक्षा की तारीख तक का सुरक्षित मार्ग दर्शन"
    ],
    smartInsights: "जैसे मौसम विभाग तूफान की चेतावनी पहले देता है, वैसे ही यह हीटमैप आपको 10 दिन बाद आने वाले बैकलॉग तूफान से आज ही बचा लेता है।",
    possibleImprovements: [
      "कैलेंडर में किसी विशेष दिन को 'पूर्ण अवकाश / नो-स्टडी डे' मार्क करने की सुविधा।",
      "परीक्षा या टेस्ट की तारीखों को कैलेंडर में फ्लैग मार्क करना।",
      "मासिक दृश्य (Monthly View) में ड्रैग-एंड-ड्रॉप से लेक्चर तारीख बदलना।"
    ],
    suggestedQuestions: [
      {
        question: "अगर कैलेंडर में कोई दिन लाल (Red) दिख रहा है तो मुझे क्या करना चाहिए?",
        quickAnswer: "लाल रंग का मतलब है कि उस दिन आपके कोटे से अधिक (जैसे 18-20) लेक्चर्स का रिवीज़न निर्धारित है। आप कॉकपिट में 'ऑटो-लेवल' बटन दबाकर या कैलेंडर से उस दिन के लेक्चर्स को आगे-पीछे के हरे दिनों में शिफ्ट कर सकते हैं।"
      },
      {
        question: "क्या मैं किसी विशेष तारीख पर क्लिक करके उस दिन के लेक्चर्स देख सकता हूँ?",
        quickAnswer: "हाँ! 30-दिन कैलेंडर के किसी भी बार या तारीख पर क्लिक करने से उस दिन देय लेक्चर्स की सूची नीचे अलग से खुलकर आ जाती है।"
      },
      {
        question: "क्या छुट्टियों या यात्रा के दिनों का पूर्वानुमान यह लगा सकता है?",
        quickAnswer: "हाँ, ऊपर मौजूद 'वैकेशन / अवकाश मोड' से आप आने वाले दिनों को अवकाश घोषित कर सकते हैं, जिससे सिस्टम उन दिनों में कोई रिवीज़न नहीं रखेगा।"
      },
      {
        question: "यह बार चार्ट प्रतिदिन कैसे अपडेट होता है?",
        quickAnswer: "जैसे ही आप कॉकपिट में किसी लेक्चर का रिवीज़न पूरा करके Easy, Medium या Hard रेटिंग देते हैं, उसकी अगली तारीख के आधार पर कैलेंडर का भविष्य तुरंत रियल-टाइम में अपडेट हो जाता है।"
      }
    ]
  },
  audit_grid: {
    title: "प्रगति ग्रिड (Audit Frequency Matrix)",
    subtitle: "वैज्ञानिक आवृत्ति परीक्षण • स्मृति दृढ़ता का ऑडिट",
    hindiBadge: "स्मृति विश्लेषण",
    icon: <Grid3X3 className="w-5 h-5 text-emerald-600" />,
    themeColor: "emerald",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-900",
    purpose: "यह जांचना कि किन लेक्चर्स का रिवीजन वैज्ञानिक आवृत्ति (0 बार, 1 बार, 2 बार, 3+ बार) के अनुसार हुआ है, और कौन से विषय स्मृति से मिटने के कगार पर हैं।",
    howItWorks: [
      "Frequency Buckets: सभी लेक्चर्स को उनकी रिवीज़न आवृत्ति के आधार पर 4 श्रेणियों में बाँटता है: नया (0 Rev), प्रारंभिक (1 Rev), सुदृढ़ (2 Rev), और पक्का/दीर्घकालिक स्मृति (3+ Rev)।",
      "कमज़ोर कड़ियों की पहचान: जिन विषयों में 0 या 1 रिवीज़न वाले लेक्चर्स अधिक हैं, उन्हें प्राथमिकता सूची में उभारना।",
      "समीक्षा मैट्रिक्स: विषयवार तुलना जिससे पता चले कि कौन सा विषय सबसे मजबूत है और किसमें दोबारा मेहनत की जरूरत है।"
    ],
    keyFeatures: [
      "आवृत्ति वर्गीकरण कार्ड्स (0, 1, 2, 3+ Revisions)",
      "विषयवार विश्लेषण चार्ट",
      "दीर्घकालिक प्रतिधारण दर (Long-Term Retention Rate)",
      "कठिनाई वितरण (Easy vs Hard अनुपात)"
    ],
    smartInsights: "सिर्फ लेक्चर्स देखना पढ़ाई नहीं है; जब तक कोई लेक्चर 3+ बार रीवाइज़ न हो, वह परीक्षा हॉल में धोखा दे सकता है। यह ग्रिड उसी सच्चाई का आईना है।",
    possibleImprovements: [
      "विषयवार 'कमजोर अध्याय' (Weak Chapters) की अलग लिस्ट निकालना।",
      "मॉक टेस्ट के नंबरों के साथ इस आवृत्ति की तुलना का ग्राफ।",
      "परीक्षा से 15 दिन पहले 'रैपिड फायर मोड' में 0-1 वाले लेक्चर्स को बूस्ट करना।"
    ],
    suggestedQuestions: [
      {
        question: "3+ रिवीज़न का क्या महत्व है?",
        quickAnswer: "संज्ञानात्मक विज्ञान के अनुसार 3+ रिवीज़न पूरा कर चुका विषय छात्र की 'सब-कॉन्शियस मेमोरी' में चला जाता है, जहाँ परीक्षा के दबाव में भी गलतियाँ नहीं होतीं और गति 2 गुना बढ़ जाती है।"
      },
      {
        question: "यदि मेरे 0-रिवीज़न वाले लेक्चर्स बहुत ज्यादा दिख रहे हैं तो क्या रणनीति अपनाऊँ?",
        quickAnswer: "नए लेक्चर्स को एक साथ न पढ़ें। दैनिक नियम बनाएं कि रोज़ाना 2 नए लेक्चर्स + 6 पुराने 0-रिवीज़न वाले लेक्चर्स को पहले 2-Step Foundation (Day 1, Day 3) में डालें।"
      },
      {
        question: "क्या यह ग्रिड मुझे बताता है कि कौन सा विषय सबसे पीछे चल रहा है?",
        quickAnswer: "हाँ! विषयवार प्रगति कॉलम में आप तुरंत देख सकते हैं कि किस विषय में 3+ रिवीज़न सबसे कम हैं। वही विषय आपकी सबसे कमज़ोर कड़ी है जिसपर तुरंत ध्यान देना चाहिए।"
      },
      {
        question: "क्या यहाँ से किसी लेक्चर को सीधे रीवाइज़ किया जा सकता है?",
        quickAnswer: "प्रगति ग्रिड विश्लेषण और रणनीति के लिए है; वास्तविक रिवीज़न दैनिक कॉकपिट में प्राथमिक कतार के अनुसार कराया जाता है।"
      }
    ]
  },
  debt_vault: {
    title: "पुराना बैकलॉग (Strategic Debt Vault)",
    subtitle: "तनाव-मुक्त वॉल्ट • मनोवैज्ञानिक भार से पूर्ण मुक्ति",
    hindiBadge: "मानसिक राहत वॉल्ट",
    icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
    themeColor: "amber",
    accentBg: "bg-stone-900 border-stone-800 text-stone-100",
    purpose: "पुराने 424 लेक्चर्स के विशाल बैकलॉग को देखकर छात्र अक्सर पढ़ाई छोड़ देते हैं। यह वॉल्ट पुराने अटके लेक्चर्स को एक 'सुरक्षित तिजोरी' में रख देता है, जिससे कॉकपिट शून्य हो जाता है और छात्र 10-15 प्राथमिक लेक्चर्स से नई ऊर्जा के साथ शुरुआत कर पाता है।",
    howItWorks: [
      "Phase 1 - मानसिक रिसेट: पुराने भारी बैकलॉग को सुरक्षित आर्काइव में भेजकर वर्तमान कार्यभार को 10-15 लेक्चर्स पर रीसेट करना।",
      "Phase 2 - धीरे-धीरे रिकवरी: जब आज का कोटा पूरा हो जाए और अतिरिक्त समय बचे, तब वॉल्ट से 2-3 महत्वपूर्ण लेक्चर्स निकाल कर वापस मुख्य ट्रैक पर लाना।",
      "सुरक्षित रिस्टोर: कोई भी डेटा डिलीट नहीं होता, सिर्फ वर्तमान स्क्रीन से अलग तिजोरी में रहता है। आवश्यकता पड़ने पर एक क्लिक में वापस लाया जा सकता है।"
    ],
    keyFeatures: [
      "सुरक्षित आर्काइव काउंटर (कितने लेक्चर्स वॉल्ट में हैं)",
      "एक-क्लिक में चुनिंदा या सभी लेक्चर्स रिस्टोर करने का विकल्प",
      "अंतिम रिसेट की तारीख व इतिहास",
      "दैनिक तनाव स्तर में 90% तक त्वरित कमी"
    ],
    smartInsights: "पुराना बैकलॉग बोझ नहीं बल्कि जमा धन है जिसे सुरक्षित रख दिया गया है। पहले वर्तमान को जीतें, फिर पुराने को धीरे-धीरे समेटें।",
    possibleImprovements: [
      "वीकेंड (रविवार) पर वॉल्ट से 5 सबसे जरूरी लेक्चर्स को ऑटोमैटिक 'बूस्टर खुराक' के रूप में शेड्यूल करना।",
      "विषयवार बैकलॉग गंभीरता स्कोर दिखाना।",
      "सिलेबस में हाई-वेटेज (ज्यादा अंक वाले) लेक्चर्स को वॉल्ट से पहले बाहर निकालने का स्मार्ट सुझाव।"
    ],
    suggestedQuestions: [
      {
        question: "क्या वॉल्ट में लेक्चर्स डालने से मेरा कोई डेटा डिलीट या ख़राब तो नहीं होगा?",
        quickAnswer: "बिल्कुल नहीं! 100% डेटा सुरक्षित रहता है। यह केवल मानसिक राहत के लिए स्क्रीन से छिपाकर 'तिजोरी' में रख दिया जाता है ताकि आपका मन पढ़ाई में लगे।"
      },
      {
        question: "वॉल्ट से पुराने लेक्चर्स को वापस मुख्य कतार में कैसे निकालें?",
        quickAnswer: "वॉल्ट टैब में 'रीस्टोर (Restore)' बटन दिया गया है। जब भी आपका आज का कोटा समय से पहले पूरा हो जाए, आप 2-3 लेक्चर्स को एक क्लिक से वापस कॉकपिट में ला सकते हैं।"
      },
      {
        question: "क्या मुझे सारे 424 लेक्चर्स को एक साथ रीवाइज़ करने की कोशिश करनी चाहिए?",
        quickAnswer: "नहीं, यही सबसे बड़ी गलती होती है। मानव मस्तिष्क एक दिन में 8-12 से अधिक गुणवत्तापूर्ण रिवीज़न नहीं कर सकता। वॉल्ट इसीलिए बनाया गया है ताकि आप केवल आज के 10 लेक्चर्स पर ध्यान दें।"
      },
      {
        question: "वॉल्ट का उपयोग कब करना चाहिए?",
        quickAnswer: "जब भी आपको लगे कि पेंडिंग लेक्चर्स की संख्या 30-40 से ऊपर पहुँच गई है और आपको तनाव या अपराध-बोध महसूस हो रहा है, तुरंत वॉल्ट रिसेट चलाएं।"
      }
    ]
  },
  more: {
    title: "अधिक टूल्स व मेन्यू (More Hub)",
    subtitle: "अतिरिक्त सुविधाएं • मिस्टेक बैंक • फोकस टाइमर • स्टडी नोट्स • Google Sheets Sync",
    hindiBadge: "टूल्स व सेटिंग्स हब",
    icon: <Menu className="w-5 h-5 text-indigo-500" />,
    themeColor: "indigo",
    accentBg: "bg-indigo-50 border-indigo-200 text-indigo-900",
    purpose: "सभी सहायक टूल्स जैसे कमज़ोर टॉपिक मिस्टेक बैंक, पोमोडोरो टाइमर, फॉर्मूला व नोट्स एडिटर, और डेटाबेस सिंक को एक सुव्यवस्थित स्थान पर प्रदान करना।",
    howItWorks: [
      "1-टैप नेविगेशन: मिस्टेक बैंक, फोकस टाइमर, स्टडी नोट्स और सेटिंग्स तक तुरंत पहुंचें।",
      "मास्टर डेटाबेस व वॉल्ट: 424 लेक्चर्स और पुराने बैकलॉग वॉल्ट को प्रबंधित करें।",
      "बैकअप व सिंक: Google Sheets Apps Script और CSV एक्सपोर्ट की मदद से अपना अध्ययन डेटा सुरक्षित रखें।",
      "वेकेशन मोड: पढ़ाई में ब्रेक लेने के लिए शेड्यूल पॉज़ करें।"
    ],
    keyFeatures: [
      "⚠️ कमज़ोर टॉपिक्स व मिस्टेक बैंक (Hard Rating Queue)",
      "⏱️ फोकस स्टडी टाइमर व स्टॉपवॉच (Pomodoro)",
      "📝 डिजिटल सूत्र व स्टडी नोट्स एडिटर",
      "📊 संपूर्ण मास्टर लेक्चर्स डेटाबेस",
      "🛡️ पुराना बैकलॉग वॉल्ट",
      "☁️ Google Sheets Apps Script सिंक"
    ],
    smartInsights: "यह मेन्यू आपके ऐप को अव्यवस्थित होने से बचाता है और सभी पावर-यूज़र टूल्स को उंगलियों के इशारे पर उपलब्ध रखता है।",
    possibleImprovements: [
      "कस्टम शॉर्टकट पिनिंग",
      "टूल्स की री-ऑर्डरिंग"
    ],
    suggestedQuestions: [
      {
        question: "मिस्टेक बैंक में कौन से टॉपिक्स आते हैं?",
        quickAnswer: "जिन टॉपिक्स को आपने 'Hard' रेटिंग दी है या जिनमें पिछली गलतियां दर्ज हैं, वे सीधे मिस्टेक बैंक में समीक्षा के लिए दिखते हैं।"
      },
      {
        question: "क्या मैं यहां से संपूर्ण लेक्चर्स डेटाबेस देख सकता हूँ?",
        quickAnswer: "हाँ, मोर हब के अंदर 'मास्टर डेटाबेस' कार्ड पर क्लिक करके आप सभी 424 लेक्चर्स को फ़िल्टर और सर्च कर सकते हैं।"
      }
    ]
  }
};

export const TabGuideModal: React.FC<TabGuideModalProps> = ({
  isOpen,
  tabKey,
  onClose,
  onSwitchTab,
}) => {
  // Modal states
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "ai_ask">("overview");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedQuickQuestion, setSelectedQuickQuestion] = useState<string | null>(null);
  const aiAnswerRef = useRef<HTMLDivElement>(null);

  // Reset states on tab change
  useEffect(() => {
    if (tabKey) {
      setCustomQuestion("");
      setAiAnswer(null);
      setAiError(null);
      setSelectedQuickQuestion(null);
      setActiveSubTab("overview");
    }
  }, [tabKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tabKey) return null;

  const data = TAB_GUIDES[tabKey];
  if (!data) return null;

  // Handler to ask AI about this specific tab
  const handleAskTabAI = async (queryToAsk: string) => {
    if (!queryToAsk.trim()) return;

    setActiveSubTab("ai_ask");
    setAiLoading(true);
    setAiError(null);
    setAiAnswer(null);
    setSelectedQuickQuestion(queryToAsk);

    try {
      const response = await fetch("/api/gemini/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionQuery: `[ऐप टैब विश्लेषण प्रश्न - ${data.title}]: ${queryToAsk}\n\nटैब का उद्देश्य: ${data.purpose}\nकाम करने का तरीका: ${data.howItWorks.join("; ")}`,
          subject: "रिवीज़न प्लानर ऐप आर्किटेक्चर एवं अध्ययन रणनीति",
          chapter: data.title,
          lecture: data.subtitle,
          contextType: "App Tab Feature Explainer & Study Strategy",
        }),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "उत्तर प्राप्त करने में त्रुटि हुई।");
      }

      setAiAnswer(resJson.answer);
      setTimeout(() => {
        aiAnswerRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error("Tab AI query error:", err);
      // Fallback: check if it's one of the suggested questions to provide instant pre-computed answer
      const matched = data.suggestedQuestions.find(q => q.question === queryToAsk);
      if (matched) {
        setAiAnswer(`💡 **स्मार्ट उत्तर:**\n\n${matched.quickAnswer}\n\n*(नोट: यह तत्काल अंतर्निहित गाइड उत्तर है)*`);
      } else {
        setAiError(err?.message || "AI से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।");
      }
    } finally {
      setAiLoading(false);
    }
  };

  // Instant answer for suggested questions (fast UX, fallback to API if desired)
  const handleQuickQuestionClick = (item: QuickQuestion) => {
    setActiveSubTab("ai_ask");
    setSelectedQuickQuestion(item.question);
    setCustomQuestion(item.question);
    setAiLoading(false);
    setAiError(null);
    setAiAnswer(`💡 **विस्तृत उत्तर (Quick Insight):**\n\n${item.quickAnswer}\n\n---\n*आप ऊपर दिए गए टेक्स्ट बॉक्स से कोई भी अन्य सवाल सीधे Gemini AI से भी पूछ सकते हैं।*`);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-stone-900/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        role="dialog" 
        aria-modal="true"
        className="relative bg-white w-full max-w-2xl my-auto rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/90 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 rounded-xl bg-white shadow-xs border border-stone-200 shrink-0">
              {data.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {data.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-100 text-amber-900">
                  {data.hindiBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium line-clamp-1">
                {data.subtitle}
              </p>
            </div>
          </div>
          <button
            id="btn-close-tab-guide"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors ml-2"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs inside Dialog: Overview vs AI Helper */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-4 sm:px-5 py-1.5 gap-2 shrink-0 text-xs font-semibold">
          <button
            id="subtab-overview"
            type="button"
            onClick={() => setActiveSubTab("overview")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === "overview"
                ? "bg-white text-stone-900 shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-700" />
            <span>टैब गाइड व उद्देश्य</span>
          </button>

          <button
            id="subtab-ai-ask"
            type="button"
            onClick={() => setActiveSubTab("ai_ask")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === "ai_ask"
                ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                : "text-stone-700 hover:text-stone-950 bg-amber-100/60"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-900" />
            <span>Gemini AI सवाल-जवाब</span>
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-stone-800 text-xs sm:text-sm">
          
          {activeSubTab === "overview" ? (
            <>
              {/* 1. मुख्य उद्देश्य (Purpose) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wider text-amber-800">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>मुख्य उद्देश्य (Core Purpose)</span>
                </div>
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 leading-relaxed font-medium text-stone-900">
                  {data.purpose}
                </div>
              </div>

              {/* 2. यह कैसे काम करता है (How It Works) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-700">
                  <Cpu className="w-4 h-4 text-stone-700" />
                  <span>काम करने का वैज्ञानिक तरीका (Mechanism)</span>
                </div>
                <div className="space-y-2">
                  {data.howItWorks.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs leading-relaxed text-stone-700 font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. मुख्य विशेषताएँ (Key Features) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wider text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>इस टैब की प्रमुख सुविधाएँ (Key Tools)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-stone-800 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. मनोवैज्ञानिक समझ (Smart Insight) */}
              <div className="p-3.5 bg-stone-900 text-stone-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                  <Lightbulb className="w-4 h-4" />
                  <span>स्मार्ट अध्ययन अंतर्दृष्टि (Insight)</span>
                </div>
                <p className="text-xs leading-relaxed text-stone-300">
                  {data.smartInsights}
                </p>
              </div>

              {/* 5. खामी, सुधार व नए फीचर्स के विचार (Brainstorming & Improvements) */}
              <div className="space-y-2 border-t border-stone-200 pt-4">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wider text-indigo-900">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>भविष्य के संभावित सुधार व नए फीचर्स (Ideas for Improvement)</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  आप इनमें से किसी भी सुधार को जोड़ने या अपनी पढ़ाई के अनुकूल नया फ़ीचर बनवाने के लिए चैट में कह सकते हैं:
                </p>
                <div className="space-y-1.5">
                  {data.possibleImprovements.map((imp, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200/60 text-xs text-indigo-950 font-medium flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">💡</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* AI Interactive Q&A Mode */
            <div className="space-y-4">
              
              {/* AI Header explanation */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-stone-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>'{data.title}' के बारे में कुछ भी पूछें</span>
                </div>
                <p className="text-xs text-stone-600">
                  इस टैब के नियमों, फॉर्मूलों, लोड बैलेंसिंग या पढ़ाई की रणनीति के बारे में नीचे दिए गए सवालों पर सीधे क्लिक करें या अपना मनपसंद सवाल लिखकर पूछें।
                </p>
              </div>

              {/* Custom Ask Bar */}
              <div className="flex items-center gap-2">
                <input
                  id="input-tab-ai-question"
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !aiLoading) {
                      handleAskTabAI(customQuestion);
                    }
                  }}
                  placeholder={`जैसे: इस टैब से मुझे पढ़ाई में अधिकतम फायदा कैसे मिलेगा?`}
                  className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <button
                  id="btn-send-tab-ai-question"
                  type="button"
                  disabled={aiLoading || !customQuestion.trim()}
                  onClick={() => handleAskTabAI(customQuestion)}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <Send className="w-4 h-4 text-amber-400" />
                  )}
                  <span>पूछें</span>
                </button>
              </div>

              {/* AI Response Display */}
              {aiLoading && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center gap-2.5 text-xs text-stone-600">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Gemini AI उत्तर तैयार कर रहा है...</span>
                </div>
              )}

              {aiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {aiError}
                </div>
              )}

              {aiAnswer && (
                <div 
                  ref={aiAnswerRef}
                  className="p-4 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 shadow-sm space-y-2 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <Bot className="w-4 h-4" />
                      <span>AI उत्तर</span>
                    </div>
                    {selectedQuickQuestion && (
                      <span className="text-[10px] text-stone-400 line-clamp-1 max-w-[200px]">
                        {selectedQuickQuestion}
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-[13px] leading-relaxed text-stone-200 whitespace-pre-wrap">
                    {aiAnswer}
                  </div>
                </div>
              )}

              {/* Pre-configured One-Touch Questions (Tap to get instant answer) */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-xs text-stone-700">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>अक्सर पूछे जाने वाले सवाल (एक टच में जवाब पाएँ):</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {data.suggestedQuestions.map((sq, idx) => {
                    const isSelected = selectedQuickQuestion === sq.question;
                    return (
                      <button
                        key={idx}
                        id={`btn-quick-q-${idx}`}
                        type="button"
                        onClick={() => handleQuickQuestionClick(sq)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 text-xs ${
                          isSelected
                            ? "bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs"
                            : "bg-stone-50/80 hover:bg-amber-50/50 border-stone-200 hover:border-amber-200 text-stone-800"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold mt-0.5">Q{idx + 1}.</span>
                          <span className="leading-snug">{sq.question}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Quick FAQ Strip on Overview tab as well so user sees questions immediately */}
          {activeSubTab === "overview" && (
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>इस टैब से जुड़े आम सवाल (टच करके तुरंत जवाब देखें):</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("ai_ask")}
                  className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
                >
                  <span>AI से पूछें</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.suggestedQuestions.slice(0, 4).map((sq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickQuestionClick(sq)}
                    className="p-2 text-left rounded-lg bg-white border border-stone-200/80 hover:border-amber-300 hover:bg-amber-50/40 text-[11px] font-medium text-stone-800 transition-colors flex items-center justify-between gap-1.5"
                  >
                    <span className="line-clamp-1">👉 {sq.question}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (activeSubTab === "overview") {
                setActiveSubTab("ai_ask");
              } else {
                setActiveSubTab("overview");
              }
            }}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            {activeSubTab === "overview" ? (
              <>
                <Bot className="w-4 h-4 text-amber-600" />
                <span>AI सवाल-जवाब खोलें</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-stone-700" />
                <span>गाइड सारांश पर लौटें</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {onSwitchTab && (
              <button
                type="button"
                onClick={() => {
                  onSwitchTab(tabKey);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-bold text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-xl transition-colors"
              >
                इस टैब पर जाएँ
              </button>
            )}
            <button
              id="btn-understand-tab-guide"
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
            >
              समझ गया (Close)
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
