import React, { useState } from "react";
import { 
  ArrowLeft,
  FileSpreadsheet, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Download,
  AlertTriangle,
  ShieldCheck,
  Terminal,
  RefreshCw,
  HelpCircle,
  Play
} from "lucide-react";
import { 
  APPS_SCRIPT_V8_8_CODE, 
  DEFAULT_SPREADSHEET_URL, 
  DEFAULT_SPREADSHEET_ID 
} from "../utils/appsScriptCode";

interface AppsScriptSyncViewProps {
  onGoBack: () => void;
  onExportCSV: () => void;
  backTitle?: string;
  onSyncLiveSheet?: (sheetId: string) => Promise<{ count: number; message: string }>;
}

export const AppsScriptSyncView: React.FC<AppsScriptSyncViewProps> = ({
  onGoBack,
  onExportCSV,
  backTitle = "वापस",
  onSyncLiveSheet
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"auth_guide" | "script_code" | "live_sync">("auth_guide");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({
    type: "idle",
    message: ""
  });
  const [sheetIdInput, setSheetIdInput] = useState<string>(DEFAULT_SPREADSHEET_ID);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_V8_8_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([APPS_SCRIPT_V8_8_CODE], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SmartRevision_v8.8_Engine.gs";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTriggerLiveSync = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: "idle", message: "" });
    try {
      if (onSyncLiveSheet) {
        const res = await onSyncLiveSheet(sheetIdInput.trim());
        setSyncStatus({
          type: "success",
          message: res.message || `सफलता! ${res.count} लेक्चर्स सफलतापूर्वक सिंक हो गए।`
        });
      } else {
        // Fallback fetch via server proxy
        const res = await fetch(`/api/sheets/fetch?sheetId=${encodeURIComponent(sheetIdInput.trim())}&gid=625661383`);
        if (!res.ok) throw new Error("Google Sheets से डेटा लोड करने में त्रुटि आई");
        const text = await res.text();
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        setSyncStatus({
          type: "success",
          message: `सफलता! Google Sheet से ${Math.max(0, lines.length - 2)} लेक्चर्स का डेटा प्राप्त हुआ!`
        });
      }
    } catch (err: any) {
      setSyncStatus({
        type: "error",
        message: err.message || "सिंक करने में विफल। कृपया इंटरनेट कनेक्शन या शीट लिंक जांचें।"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onGoBack}
            aria-label="वापस जाएं"
            className="h-8 w-8 sm:w-auto px-0 sm:px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-stone-200 cursor-pointer shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">{backTitle}</span>
          </button>

          <div className="h-4 w-px bg-stone-200 hidden sm:block" />

          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-stone-900 tracking-tight leading-tight truncate">
                Google Sheets & Apps Script ऑटोमेशन इंजन (v8.8)
              </h2>
              <p className="text-[11px] text-stone-500 truncate">
                ऑथराइजेशन समाधान गाइड, कमांड निर्देश और बुलेटप्रूफ ऑटोमेशन इंजन
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
          <a
            href="/api/download-html"
            download="Smart-Revision-Cockpit-Standalone-Web-App.html"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>संपूर्ण Web HTML डाउनलोड</span>
          </a>

          <a
            href={DEFAULT_SPREADSHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">शीट खोलें</span>
          </a>

          <button
            type="button"
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>CSV / Excel एक्सपोर्ट</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("auth_guide")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "auth_guide"
              ? "bg-white text-stone-900 shadow-xs border border-stone-200"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>ऑथराइजेशन समाधान गाइड</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("script_code")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "script_code"
              ? "bg-white text-stone-900 shadow-xs border border-stone-200"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-600" />
          <span>v8.8 इंजन कोड (Code.gs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("live_sync")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "live_sync"
              ? "bg-white text-stone-900 shadow-xs border border-stone-200"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
          }`}
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span>1-क्लिक लाइव शीट सिंक</span>
        </button>
      </div>

      {/* TAB 1: AUTHORIZATION SOLUTION & COMMAND GUIDE */}
      {activeTab === "auth_guide" && (
        <div className="space-y-4">
          {/* Main Resolution Alert Card */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-amber-950">
                    "Authorised पर click करने पर यह आ रहा है" — समाधान
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    सामान्य Google सुरक्षा नियम
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  जब आप पहली बार Apps Script में <strong>'Run'</strong> या <strong>'Authorise'</strong> दबाते हैं, तो Google आपको चेतावनी दिखाता है:
                  <br />
                  <span className="font-bold text-amber-900">"Google hasn’t verified this app" (Google ने इस ऐप को सत्यापित नहीं किया है)</span>
                </p>
                <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 text-xs text-stone-800 space-y-1">
                  <p className="font-bold text-amber-950">⚠️ यह कोई एरर या बग नहीं है!</p>
                  <p className="text-[11px] text-stone-600">
                    चूँकि यह स्क्रिप्ट आपके अपने निजी Google Account में बनी है और इसे सार्वजनिक वेब स्टोर पर पब्लिश नहीं किया गया है, इसलिए Google हर निजी स्क्रिप्ट के लिए यह मानक स्क्रीन दिखाता है। इसे बायपास करने के लिए नीचे दिए गए 3 कदम उठाएं:
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Steps Visual Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-amber-200/60">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">Back to safety मत दबाएं</span>
                </div>
                <h4 className="text-xs font-black text-stone-900">"Advanced" पर क्लिक करें</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  स्क्रीन पर नीले रंग का "Back to safety" बटन होगा, उसे <strong>न दबाएं</strong>। नीचे बाईं ओर छोटे अक्षरों में लिखे <strong>Advanced (उन्नत)</strong> पर क्लिक करें।
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">असुरक्षित लिंक पर जाएं</span>
                </div>
                <h4 className="text-xs font-black text-stone-900">"Go to [Project] (unsafe)"</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Advanced पर क्लिक करने के बाद नीचे एक नया लिंक आएगा: <strong>Go to [प्रोजेक्ट नाम] (unsafe)</strong>। उस पर क्लिक करें।
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">अनुमति दें</span>
                </div>
                <h4 className="text-xs font-black text-stone-900">"Allow" (अनुमति दें)</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  अब Google आपको स्प्रेडशीट एडिट करने की अनुमति मांगेगा। नीचे नीले रंग के <strong>Allow (अनुमति दें)</strong> बटन पर क्लिक करें। बस काम पूरा!
                </p>
              </div>
            </div>
          </div>

          {/* Question 2: "यह कमांड किसको देना है" Answer */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  "यह कमांड किसको देना है?" — स्पष्ट निर्देश
                </h3>
                <p className="text-[11px] text-stone-500">
                  Google Sheet में कोई टर्मिनल या कमांड लाइन (CMD) नहीं होती!
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 space-y-2 text-xs text-stone-700">
              <p className="leading-relaxed">
                आपको किसी को टाइप करके कोई कमांड नहीं देना है। यह पूरी स्क्रिप्ट आपकी Google Sheet के अंदर ही चलती है:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-800 font-medium pl-1">
                <li>
                  अपनी Google Sheet खोलें और ऊपर मेनू में <strong>Extensions (एक्सटेंशन) &gt; Apps Script</strong> पर जाएं।
                </li>
                <li>
                  वहाँ बाईं ओर <strong>Code.gs</strong> दिखेगा। पुराने कोड को हटाकर नीचे दिया गया <strong>v8.8 - BULLETPROOF</strong> कोड पेस्ट करें।
                </li>
                <li>
                  कीबोर्ड से <strong>Ctrl + S (Save)</strong> दबाएं।
                </li>
                <li>
                  ऊपर टूलबार में ड्रॉपडाउन से <strong>onOpen</strong> या <strong>rebuildMasterDatabaseFromLogs</strong> चुनें और <strong>Run (▶️ चलाएँ)</strong> दबाएं।
                </li>
                <li>
                  अब अपनी Google Sheet के टैब को <strong>Refresh (F5)</strong> करें। ऊपर मेनू बार में <strong>"🎯 रिवीजन टूल्स"</strong> का नया मेनू आ जाएगा!
                </li>
              </ol>
            </div>
          </div>

          {/* What v8.8 Engine Automates */}
          <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-black tracking-tight text-stone-100">
                  v8.8 बुलेटप्रूफ इंजन की मुख्य खूबियाँ (Automation Features)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v8.8 Bulletproof
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1">
                <span className="font-bold text-emerald-400">1. स्टॉपवॉच और टॉपिक लोडर (F39, F40, F64+)</span>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  चेकबॉक्स से 1-क्लिक में टॉपिक लोड होता है और पढ़ाई पूरी होने पर सीधे '⏱️ रिवीजन स्टडी लॉग' में समय और नोट्स सेव होते हैं।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1">
                <span className="font-bold text-blue-400">2. वेकेशन &amp; फ्रीज इंजन (C5 Toggle)</span>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  छुट्टी के समय तारीखें फ्रीज हो जाती हैं। छुट्टी खत्म होते ही सभी ड्यू डेट्स आगे बढ़ जाती हैं जिससे कोई झूठा बैकलॉग नहीं बनता।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1">
                <span className="font-bold text-amber-400">3. ऑटो-शिफ्ट ओवरड्यू रिवीज़न (F57 Trigger)</span>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  पुराने बैकलॉग को समान रूप से आने वाले दिनों में बाँट देता है ताकि छात्र पर एक ही दिन में बोझ न पड़े।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1">
                <span className="font-bold text-purple-400">4. रीबिल्ड मास्टर डेटाबेस (Auto Row Insertion)</span>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  स्टडी लॉग के आधार पर हर लेक्चर का रिवीज़न काउंट, मिन/एवरेज/मैक्स टाइम और अगली तारीख खुद ब खुद रीबिल्ड करता है।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE V8.8 SCRIPT CODE */}
      {activeTab === "script_code" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-stone-900">
                Code.gs (🎯 DASHBOARD &amp; MASTER DATABASE AUTOMATION ENGINE v8.8)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadScript}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Code.gs डाउनलोड</span>
              </button>

              <button
                type="button"
                onClick={copyToClipboard}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  copied 
                    ? "bg-emerald-600 text-white" 
                    : "bg-stone-900 hover:bg-stone-800 text-white"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? "कोड कॉपी हो गया!" : "पूरा कोड कॉपी करें"}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-stone-900 rounded-3xl p-4 shadow-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-[11px] text-stone-400 font-mono">
              <span>Google Apps Script Editor &gt; Code.gs</span>
              <span>v8.8 - BULLETPROOF EDITION</span>
            </div>

            <pre className="text-stone-300 font-mono text-xs overflow-x-auto p-3 bg-stone-950/80 rounded-2xl leading-relaxed max-h-[520px] overflow-y-auto">
              <code>{APPS_SCRIPT_V8_8_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: 1-CLICK LIVE SYNC */}
      {activeTab === "live_sync" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                <RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-stone-900">
                  सीधे Google Spreadsheet से 1-क्लिक लाइव सिंक
                </h3>
                <p className="text-xs text-stone-500">
                  आपकी स्प्रेडशीट के सभी 1,289+ मास्टर लेक्चर्स और स्टडी लॉग सीधे इस ऐप में सिंक करें।
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                आपकी Google Sheet ID या URL:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={sheetIdInput}
                  onChange={(e) => setSheetIdInput(e.target.value)}
                  placeholder="Google Spreadsheet ID या URL"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
                <button
                  type="button"
                  onClick={handleTriggerLiveSync}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "डेटा सिंक हो रहा है..." : "लाइव डेटा सिंक करें"}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                डिफ़ॉल्ट स्प्रेडशीट: <span className="font-mono text-stone-700">{DEFAULT_SPREADSHEET_ID}</span>
              </p>
            </div>

            {/* Sync Feedback */}
            {syncStatus.message && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                  syncStatus.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                {syncStatus.type === "success" ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{syncStatus.message}</span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
              <span className="font-bold text-stone-800">💡 यह कैसे काम करता है?</span>
              <p className="text-[11px] leading-relaxed">
                यह ऐप आपकी स्प्रेडशीट के <strong>'Master Database'</strong> (GID: 625661383) और <strong>'⏱️ रिवीजन स्टडी लॉग'</strong> (GID: 876075633) को सीधे लोड करता है। आप कभी भी दोनों जगहों से अपने डेटा को सिंक कर सकते हैं।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
