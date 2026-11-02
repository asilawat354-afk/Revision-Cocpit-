import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Code2, 
  Copy, 
  Check, 
  X, 
  ExternalLink,
  Sparkles,
  Download,
  AlertTriangle,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { 
  APPS_SCRIPT_V8_8_CODE, 
  DEFAULT_SPREADSHEET_URL, 
  DEFAULT_SPREADSHEET_ID 
} from "../utils/appsScriptCode";

interface AppsScriptSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: () => void;
}

export const AppsScriptSyncModal: React.FC<AppsScriptSyncModalProps> = ({
  isOpen,
  onClose,
  onExportCSV,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showAuthGuide, setShowAuthGuide] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleCopyCode = () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 animate-in fade-in duration-150">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[92vh] glass-specular">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-start space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900">
                  Google Sheets ऑटोमेशन इंजन (v8.8)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  v8.8 Bulletproof
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                ऑथराइजेशन समाधान, कमांड गाइड व बुलेटप्रूफ ऑटोमेशन कोड
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="बंद करें"
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-3 overflow-y-auto space-y-3.5 flex-1 pr-1">
          
          {/* Quick Resolution Alert Box */}
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>"Google hasn't verified this app" समाधान:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthGuide(!showAuthGuide)}
                className="text-[11px] text-amber-800 hover:underline font-bold"
              >
                {showAuthGuide ? "संक्षिप्त करें" : "विस्तार से देखें"}
              </button>
            </div>

            {showAuthGuide && (
              <div className="text-[11px] text-stone-700 space-y-1.5 pt-1">
                <p>
                  जब आप <strong>Authorise</strong> पर क्लिक करते हैं, तो Google यह सुरक्षा स्क्रीन दिखाता है:
                </p>
                <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 space-y-1 font-medium">
                  <p>1. <span className="text-rose-600 font-bold">Back to safety</span> पर क्लिक <strong>न करें</strong>।</p>
                  <p>2. नीचे बाईं ओर छोटे अक्षरों में लिखे <strong>"Advanced" (उन्नत)</strong> पर क्लिक करें।</p>
                  <p>3. फिर नीचे आने वाले <strong>"Go to [Project Name] (unsafe)"</strong> पर क्लिक करें।</p>
                  <p>4. अब <strong>"Allow" (अनुमति दें)</strong> पर क्लिक करें।</p>
                </div>
                <p className="text-stone-500 italic text-[10px]">
                  💡 यह कोई एरर नहीं है, खुद के Google Account की स्क्रिप्ट के लिए यह सामान्य है।
                </p>
              </div>
            )}
          </div>

          {/* Guide Bar */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div>
              <span className="font-bold text-stone-900">कमांड किसको देना है?</span>
              <p className="text-stone-600 mt-0.5 text-[11px]">
                Google Sheet खोलें &gt; <strong>Extensions &gt; Apps Script</strong> &gt; कोड पेस्ट करें &gt; <strong>Save (Ctrl+S)</strong> &gt; <strong>Run (onOpen)</strong> दबाएं। शीट रिफ्रेश करते ही ऊपर <strong>🎯 रिवीजन टूल्स</strong> मेनू आ जाएगा!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadScript}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center space-x-1.5 transition-colors text-xs border border-stone-200"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Code.gs</span>
              </button>

              <button
                onClick={onExportCSV}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 transition-colors text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV डाउनलोड</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 text-stone-200 font-mono text-xs">
            <div className="flex items-center justify-between px-3.5 py-2 bg-stone-900 border-b border-stone-800 text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Code.gs (v8.8 - BULLETPROOF)</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "कॉपी हुआ!" : "कोड कॉपी करें"}</span>
              </button>
            </div>

            <pre className="p-3.5 overflow-x-auto max-h-60 leading-relaxed text-[11px] text-stone-300">
              {APPS_SCRIPT_V8_8_CODE}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
          <a
            href={DEFAULT_SPREADSHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Sheet खोलें</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold cursor-pointer transition-colors"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
