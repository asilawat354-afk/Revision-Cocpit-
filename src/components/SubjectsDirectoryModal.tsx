import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  Search, 
  Check, 
  Layers, 
  Filter,
  Plus,
  ArrowRight
} from "lucide-react";
import { SUBJECT_CHAPTER_CATALOG, SubjectCatalogItem } from "../data/subjectChapterCatalog";

interface SubjectsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter?: (subject: string, chapter: string) => void;
}

export const SubjectsDirectoryModal: React.FC<SubjectsDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectChapter
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expandedSubjectId, setExpandedSubjectId] = useState<string>("maths_arithmetic");

  if (!isOpen) return null;

  const categories = ["ALL", "Maths", "Reasoning", "Science", "General Studies", "Computer", "Special / Other"];

  const filteredSubjects = SUBJECT_CHAPTER_CATALOG.filter((sub) => {
    if (selectedCategory !== "ALL" && sub.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = sub.name.toLowerCase().includes(q);
      const matchChapters = sub.chapters.some((c) => c.toLowerCase().includes(q));
      return matchSubject || matchChapters;
    }
    return true;
  });

  const totalChaptersCount = SUBJECT_CHAPTER_CATALOG.reduce((acc, s) => acc + s.chapters.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 animate-in fade-in duration-150">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[90vh] glass-specular">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-stone-900 text-amber-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  विषय एवं अध्याय निर्देशिका
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {SUBJECT_CHAPTER_CATALOG.length} विषय • {totalChaptersCount} अध्याय
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Dashboard Sheet (Range I3:J310) से सभी आधिकारिक विषय एवं अध्याय
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-stone-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="विषय या अध्याय खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-medium text-stone-800 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat === "ALL" ? "सभी" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Two columns (Subject list on left, chapters on right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3 overflow-hidden flex-1 min-h-[300px]">
          
          {/* Left: Subjects List */}
          <div className="md:col-span-5 overflow-y-auto space-y-1.5 pr-1 border-r border-stone-100">
            {filteredSubjects.map((sub) => {
              const isSelected = expandedSubjectId === sub.id;
              const isArithmetic = sub.id === "maths_arithmetic";
              return (
                <button
                  key={sub.id}
                  onClick={() => setExpandedSubjectId(sub.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-amber-500/10 text-stone-900 border border-amber-300 font-bold"
                      : "bg-stone-50/70 hover:bg-stone-100 text-stone-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="truncate">{sub.name}</span>
                    {isArithmetic && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        सक्रिय
                      </span>
                    )}
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-white border border-stone-200 text-stone-600">
                    {sub.chapters.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Chapters Grid */}
          <div className="md:col-span-7 overflow-y-auto pl-1">
            {(() => {
              const currentSubject = SUBJECT_CHAPTER_CATALOG.find((s) => s.id === expandedSubjectId) || filteredSubjects[0];
              if (!currentSubject) {
                return (
                  <div className="h-full flex items-center justify-center text-xs text-stone-400">
                    कोई विषय नहीं मिला
                  </div>
                );
              }

              const visibleChapters = currentSubject.chapters.filter((c) =>
                searchQuery.trim() ? c.toLowerCase().includes(searchQuery.toLowerCase()) : true
              );

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        {currentSubject.name}
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        {visibleChapters.length} अध्याय उपलब्ध
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visibleChapters.map((ch, idx) => {
                      const meta = currentSubject.chapterMeta?.find((m) => m.name === ch);
                      const lecCount = meta ? meta.lectureCount : undefined;
                      return (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors flex items-center justify-between group text-xs"
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <span className="text-[10px] font-mono text-stone-400 w-4 text-right shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="font-semibold text-stone-800 truncate">
                              {ch}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            {lecCount !== undefined && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-200/70 text-stone-700">
                                {lecCount} lec
                              </span>
                            )}
                            {onSelectChapter && (
                              <button
                                onClick={() => {
                                  onSelectChapter(currentSubject.name, ch);
                                  onClose();
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-amber-700 hover:bg-amber-100 transition-all text-[11px] flex items-center gap-1 font-bold"
                                title="इस अध्याय से नया लेक्चर जोड़ें"
                              >
                                <span>चुनें</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
          <span>
            📍 वर्तमान में सक्रिय अध्ययन सामग्री: <strong className="text-stone-800">Maths- (Arithmetic)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
