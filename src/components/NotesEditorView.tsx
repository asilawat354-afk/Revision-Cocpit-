import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Save, 
  Copy, 
  Check, 
  Bold, 
  Italic, 
  List, 
  Sparkles, 
  RotateCcw, 
  FileText,
  Trash2
} from "lucide-react";
import { triggerHaptic } from "../utils/haptics";

interface NotesEditorViewProps {
  onGoBack: () => void;
  backTitle?: string;
  lectureId?: string;
  lectureTitle?: string;
}

const STORAGE_KEY = "sm_study_quick_notes";

export const NotesEditorView: React.FC<NotesEditorViewProps> = ({
  onGoBack,
  backTitle = "वापस",
  lectureId,
  lectureTitle,
}) => {
  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string>("स्वतः सुरक्षित");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, content);
      setSavedStatus("सुरक्षित");
    } catch {
      // ignore
    }
  }, [content]);

  const handleInsertText = (prefix: string, suffix: string = "") => {
    triggerHaptic(8);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleCopyAll = () => {
    triggerHaptic(10);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              onGoBack();
            }}
            aria-label="वापस जाएं"
            className="h-8 w-8 sm:w-auto px-0 sm:px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-stone-200 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">{backTitle}</span>
          </button>

          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <div>
              <h1 className="text-sm font-bold text-stone-900 leading-tight">स्टडी नोट्स व सूत्र बैंक</h1>
              <span className="text-[11px] text-stone-500 font-medium">{savedStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 border border-stone-200 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "कॉपी हुआ" : "कॉपी"}</span>
          </button>
        </div>
      </div>

      {/* Editor Toolbar & Main Area */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
        {/* Quick Markdown Toolbar */}
        <div className="border-b border-stone-200 p-2 bg-stone-50/80 flex items-center space-x-1 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleInsertText("**", "**")}
            title="बोल्ड (Bold)"
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertText("*", "*")}
            title="इटैलिक (Italic)"
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertText("\n• ")}
            title="बुलेट लिस्ट (List)"
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertText(" == ", " == ")}
            title="हाइलाइट (Highlight)"
            className="px-2 py-1 rounded-lg hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            हाइलाइट
          </button>
          <button
            type="button"
            onClick={() => handleInsertText("\n### ")}
            title="हेडिंग (Heading)"
            className="px-2 py-1 rounded-lg hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            शीर्षक
          </button>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="यहाँ अपने नोट्स, सूत्र, परिभाषाएं या त्वरित पढ़ाई विचार लिखें... (यह स्वतः सुरक्षित होता रहेगा)"
          className="w-full p-4 sm:p-6 text-sm sm:text-base font-medium text-stone-900 bg-white outline-none min-h-[400px] leading-relaxed resize-none"
        />

        {/* Footer Meta */}
        <div className="border-t border-stone-200 px-4 py-2 bg-stone-50 text-[11px] text-stone-500 flex items-center justify-between">
          <span>{wordCount} शब्द • {charCount} अक्षर</span>
          <span className="text-emerald-700 font-semibold">ऑफ़लाइन सुरक्षित</span>
        </div>
      </div>
    </div>
  );
};
