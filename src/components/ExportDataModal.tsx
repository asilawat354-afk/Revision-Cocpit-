import React, { useState, useMemo } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  BookOpen,
  Database,
  Layers,
  CheckCircle2,
  History,
  Filter,
  Sparkles,
  Check
} from "lucide-react";
import { LectureItem } from "../types";
import { SUBJECT_CHAPTER_CATALOG } from "../data/subjectChapterCatalog";
import {
  ExportDatasetType,
  ExportFormat,
  RecordFilterOption,
  executeDataExport,
  filterLecturesForExport,
  buildSyllabusRows,
  buildRevisionLogRows
} from "../utils/exportData";
import { triggerHaptic } from "../utils/haptics";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectures: LectureItem[];
  initialDataset?: ExportDatasetType;
  initialSubject?: string;
  onExportSuccess?: (message: string) => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  lectures,
  initialDataset = "all_in_one",
  initialSubject = "ALL",
  onExportSuccess,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<ExportDatasetType>(initialDataset);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("xlsx");
  const [recordFilter, setRecordFilter] = useState<RecordFilterOption>("ALL");
  const [subjectFilter, setSubjectFilter] = useState<string>(initialSubject);
  const [justExported, setJustExported] = useState<string | null>(null);

  // Sync initial props when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedDataset(initialDataset);
      setSubjectFilter(initialSubject || "ALL");
      setJustExported(null);
    }
  }, [isOpen, initialDataset, initialSubject]);

  // Live preview counts
  const matchingRecordsCount = useMemo(() => {
    return filterLecturesForExport(lectures, recordFilter, subjectFilter).length;
  }, [lectures, recordFilter, subjectFilter]);

  const matchingSyllabusChaptersCount = useMemo(() => {
    return buildSyllabusRows(lectures, subjectFilter).length;
  }, [lectures, subjectFilter]);

  const matchingLogsCount = useMemo(() => {
    return buildRevisionLogRows(lectures, subjectFilter).length;
  }, [lectures, subjectFilter]);

  if (!isOpen) return null;

  const handleQuickExport = (dataset: ExportDatasetType, format: ExportFormat) => {
    triggerHaptic(10);
    const result = executeDataExport({
      lectures,
      dataset,
      format,
      recordFilter: dataset === "records" ? recordFilter : "ALL",
      subjectFilter,
    });
    const label = format === "xlsx" ? "Excel (.xlsx)" : "CSV (.csv)";
    const msg = `📥 ${label} सफलतापूर्वक डाउनलोड हुआ: ${result.filename}`;
    setJustExported(msg);
    onExportSuccess?.(msg);
  };

  const handleCustomExport = () => {
    triggerHaptic(12);
    const result = executeDataExport({
      lectures,
      dataset: selectedDataset,
      format: selectedFormat,
      recordFilter,
      subjectFilter,
    });
    const label = selectedFormat === "xlsx" ? "Excel (.xlsx)" : "CSV (.csv)";
    const msg = `📥 ${label} फ़ाइल डाउनलोड हुई (${result.rowCount} पंक्तियाँ): ${result.filename}`;
    setJustExported(msg);
    onExportSuccess?.(msg);
  };

  const datasetOptions: {
    id: ExportDatasetType;
    title: string;
    subtitle: string;
    badge: string;
    icon: React.FC<{ className?: string }>;
    color: string;
  }[] = [
    {
      id: "all_in_one",
      title: "संपूर्ण रिकॉर्ड + सिलेबस (All-in-One Master Pack)",
      subtitle: "लेक्चर रिकॉर्ड्स, 21 विषयों का सिलेबस, विषय सारांश व रिवीज़न लॉग्स एक साथ (Excel में 4 अलग-अलग शीट्स)",
      badge: `${matchingRecordsCount} रिकॉर्ड + ${matchingSyllabusChaptersCount} अध्याय`,
      icon: Layers,
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      id: "records",
      title: "लेक्चर रिकॉर्ड्स (Lecture Records)",
      subtitle: "सभी लेक्चर्स की स्थिति, 1-Day/3-Day फाउंडेशन, रेटिंग, समय, गलतियाँ, ट्रिक्स व नोट्स",
      badge: `${matchingRecordsCount} लेक्चर्स`,
      icon: Database,
      color: "bg-sky-100 text-sky-900 border-sky-300",
    },
    {
      id: "syllabus",
      title: "संपूर्ण सिलेबस व अध्याय प्रगति (Syllabus & Progress)",
      subtitle: "21 आधिकारिक विषय, 250+ अध्याय, निर्धारित लेक्चर्स और आपकी वर्तमान पूर्णता प्रगति (%)",
      badge: `${matchingSyllabusChaptersCount} अध्याय`,
      icon: BookOpen,
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    {
      id: "revision_logs",
      title: "विस्तृत रिवीज़न इतिहास (Revision History Logs)",
      subtitle: "प्रत्येक रिवीज़न बारी (Attempt #) की तारीख, लगा समय, कठिनाई और दर्ज गलतियाँ",
      badge: `${matchingLogsCount} प्रविष्टियाँ`,
      icon: History,
      color: "bg-purple-100 text-purple-900 border-purple-300",
    },
    {
      id: "subject_summary",
      title: "21 विषय सारांश रिपोर्ट (Subject-wise Summary)",
      subtitle: "सभी 21 विषयों में कुल अध्याय, पढ़े गए लेक्चर्स, कंठस्थ लेक्चर्स व प्रतिशत का सारांश",
      badge: "21 विषय",
      icon: Sparkles,
      color: "bg-rose-100 text-rose-900 border-rose-300",
    },
  ];

  const recordFilterOptions: { id: RecordFilterOption; label: string }[] = [
    { id: "ALL", label: "सभी लेक्चर्स (All)" },
    { id: "STUDIED_ONLY", label: "केवल पढ़े गए / सक्रिय (Studied Only)" },
    { id: "DUE_TODAY", label: "आज नियत / देय (Due Today)" },
    { id: "COMPLETED", label: "कंठस्थ / पूर्ण (Mastered)" },
    { id: "HARD_MISTAKES", label: "कठिन व गलतियाँ (Hard / Mistakes)" },
    { id: "NOT_STARTED", label: "अभी बाकी (Not Started)" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 truncate">
                  रिकॉर्ड और सिलेबस एक्सपोर्ट (CSV / Excel)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black shrink-0">
                  XLSX + CSV
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                अपने लेक्चर रिकॉर्ड्स और 21 विषयों के सिलेबस को Excel (.xlsx) या CSV में डाउनलोड करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1-Click Instant Download Bar */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/70 to-amber-50/50 rounded-2xl p-3.5 sm:p-4 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>1-क्लिक त्वरित डाउनलोड (Quick Export)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800">
                हिंदी व English सपोर्टेड
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickExport("records", "xlsx")}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs transition-all cursor-pointer text-center"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>रिकॉर्ड्स Excel</span>
                <span className="text-[10px] text-emerald-100 font-normal">.xlsx डाउनलोड</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickExport("records", "csv")}
                className="p-2.5 rounded-xl bg-white hover:bg-stone-100 active:scale-95 text-stone-900 border border-stone-300 font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer text-center"
              >
                <FileText className="w-4 h-4 text-sky-700" />
                <span>रिकॉर्ड्स CSV</span>
                <span className="text-[10px] text-stone-500 font-normal">.csv डाउनलोड</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickExport("syllabus", "xlsx")}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs flex flex-col items-center justify-center gap-1 shadow-xs transition-all cursor-pointer text-center"
              >
                <BookOpen className="w-4 h-4" />
                <span>सिलेबस Excel</span>
                <span className="text-[10px] text-stone-800 font-semibold">.xlsx डाउनलोड</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickExport("syllabus", "csv")}
                className="p-2.5 rounded-xl bg-white hover:bg-stone-100 active:scale-95 text-stone-900 border border-stone-300 font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer text-center"
              >
                <FileText className="w-4 h-4 text-amber-700" />
                <span>सिलेबस CSV</span>
                <span className="text-[10px] text-stone-500 font-normal">.csv डाउनलोड</span>
              </button>
            </div>
          </div>

          {/* Step 1: Select Format (Excel .xlsx vs CSV .csv) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block">
              1. फ़ाइल फ़ॉर्मेट चुनें (Choose File Format):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                onClick={() => {
                  triggerHaptic(6);
                  setSelectedFormat("xlsx");
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  selectedFormat === "xlsx"
                    ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    XLSX
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">
                      Microsoft Excel (.xlsx)
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      मल्टी-शीट, ऑटो-कॉलम चौड़ाई व साफ टेबल फ़ॉर्मेट
                    </p>
                  </div>
                </div>
                {selectedFormat === "xlsx" && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div
                onClick={() => {
                  triggerHaptic(6);
                  setSelectedFormat("csv");
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  selectedFormat === "csv"
                    ? "border-sky-600 bg-sky-50/70 shadow-xs"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    CSV
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">
                      CSV स्प्रेडशीट (.csv)
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Google Sheets, Excel व डेटा इंपोर्ट के लिए उपयुक्त
                    </p>
                  </div>
                </div>
                {selectedFormat === "csv" && (
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Select Dataset */}
          <div className="space-y-2">
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block">
              2. क्या एक्सपोर्ट करना चाहते हैं? (Select Data):
            </label>
            <div className="space-y-2">
              {datasetOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedDataset === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      triggerHaptic(6);
                      setSelectedDataset(opt.id);
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl border ${opt.color} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-stone-900">
                            {opt.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? "bg-amber-500 text-stone-950"
                          : "border border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Optional Filters (Subject & Record Status) */}
          <div className="bg-stone-50 rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-800 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>3. विषय व स्थिति फ़िल्टर (Optional Filters):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Subject Filter */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  विषय चुनें (Subject):
                </label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
                >
                  <option value="ALL">सभी 21 विषय (All Subjects)</option>
                  {SUBJECT_CHAPTER_CATALOG.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name} ({sub.chapters.length} अध्याय)
                    </option>
                  ))}
                </select>
              </div>

              {/* Record Status Filter */}
              {(selectedDataset === "all_in_one" || selectedDataset === "records") && (
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    लेक्चर स्थिति फ़िल्टर (Record Status):
                  </label>
                  <select
                    value={recordFilter}
                    onChange={(e) => setRecordFilter(e.target.value as RecordFilterOption)}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
                  >
                    {recordFilterOptions.map((rf) => (
                      <option key={rf.id} value={rf.id}>
                        {rf.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Feedback banner if just exported */}
          {justExported && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{justExported}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
          >
            बंद करें
          </button>

          <button
            type="button"
            onClick={handleCustomExport}
            className={`py-2.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer ${
              selectedFormat === "xlsx"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-sky-600 hover:bg-sky-700 text-white"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>
              {selectedFormat === "xlsx" ? "Excel (.xlsx) डाउनलोड करें" : "CSV (.csv) डाउनलोड करें"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
