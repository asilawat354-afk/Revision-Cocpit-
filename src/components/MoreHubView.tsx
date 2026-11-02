import React from "react";
import { 
  BookOpen, 
  Database, 
  ShieldAlert, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Settings, 
  FileSpreadsheet, 
  Download, 
  ChevronRight,
  Grid3X3,
  Sparkles,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from "lucide-react";
import { triggerHaptic } from "../utils/haptics";
import { FullPageView } from "../App";
import { ActiveTab } from "./Navbar";
import { ExportDatasetType } from "../utils/exportData";

interface MoreHubViewProps {
  onNavigatePage: (pageId: FullPageView) => void;
  onNavigateTab: (tabId: ActiveTab) => void;
  archivedDebtCount: number;
  mistakesCount: number;
  totalLectures: number;
  onExportCSV: () => void;
  onOpenExportModal?: (dataset?: ExportDatasetType, subject?: string) => void;
  onOpenGemini: () => void;
  onToggleVacation?: () => void;
  isVacationActive?: boolean;
  onOpenButtonStyleModal?: () => void;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  onNavigatePage,
  onNavigateTab,
  archivedDebtCount,
  mistakesCount,
  totalLectures,
  onExportCSV,
  onOpenExportModal,
  onOpenGemini,
  onToggleVacation,
  isVacationActive = false,
  onOpenButtonStyleModal,
}) => {
  const hubCategories = [
    {
      group: "मुख्य अध्ययन अनुभाग",
      items: [
        {
          id: "subjects_directory",
          title: "विषय एवं अध्याय निर्देशिका",
          subtitle: "21 आधिकारिक विषय व 250+ अध्यायों का पाठ्यक्रम",
          icon: BookOpen,
          color: "bg-amber-100 text-amber-900",
          action: () => onNavigatePage("subjects_directory"),
        },
        {
          id: "master_db",
          title: "सभी लेक्चर्स की सूची",
          subtitle: `${totalLectures} कुल लेक्चर्स • खोज, फ़िल्टर व स्थिति`,
          icon: Database,
          color: "bg-sky-100 text-sky-900",
          action: () => onNavigatePage("master_db" as FullPageView),
        },
        {
          id: "mistake_queue",
          title: "कमज़ोर टॉपिक्स व गलतियाँ",
          subtitle: `${mistakesCount} कठिन टॉपिक्स व दर्ज गलतियाँ`,
          icon: ShieldAlert,
          color: "bg-rose-100 text-rose-900",
          badge: mistakesCount > 0 ? `${mistakesCount} समीक्षा` : undefined,
          action: () => onNavigatePage("mistake_queue" as FullPageView),
        },
        {
          id: "audit_grid",
          title: "21-दिन अभ्यास प्रगति ग्रिड",
          subtitle: "स्पैस्ड रिपीटिशन के 21-दिवसीय अंतरालों का विवरण",
          icon: Grid3X3,
          color: "bg-emerald-100 text-emerald-900",
          action: () => onNavigateTab("audit_grid"),
        },
      ],
    },
    {
      group: "स्टडी टूल्स व नोट्स",
      items: [
        {
          id: "focus_timer",
          title: "पढ़ाई का टाइमर",
          subtitle: "पोमोडोरो, डीप वर्क टाइमर व स्टॉपवॉच",
          icon: Clock,
          color: "bg-indigo-100 text-indigo-900",
          action: () => onNavigatePage("focus_timer" as FullPageView),
        },
        {
          id: "notes_editor",
          title: "स्टडी नोट्स व सूत्र बैंक",
          subtitle: "महत्वपूर्ण सूत्र, शॉर्ट नोट्स व रिवीज़न सारांश",
          icon: FileText,
          color: "bg-teal-100 text-teal-900",
          action: () => onNavigatePage("notes_editor" as FullPageView),
        },
        {
          id: "debt_vault",
          title: "बैकलॉग छंटाई व रीसेट",
          subtitle: `${archivedDebtCount} सुरक्षित लेक्चर्स • बिना तनाव पूरा करें`,
          icon: ShieldCheck,
          color: "bg-amber-100 text-amber-900",
          badge: archivedDebtCount > 0 ? `${archivedDebtCount} वॉल्ट` : undefined,
          action: () => onNavigatePage("debt_vault" as FullPageView),
        },
      ],
    },
    {
      group: "सिंक, एक्सपोर्ट व सेटिंग्स",
      items: [
        {
          id: "export_hub",
          title: "रिकॉर्ड व सिलेबस एक्सपोर्ट (CSV / Excel)",
          subtitle: "लेक्चर रिकॉर्ड्स, 21 विषयों का सिलेबस व रिवीज़न लॉग (.xlsx / .csv)",
          icon: Download,
          color: "bg-emerald-100 text-emerald-900",
          badge: "XLSX / CSV",
          action: () => {
            if (onOpenExportModal) {
              onOpenExportModal("all_in_one");
            } else {
              onExportCSV();
            }
          },
        },
        {
          id: "apps_script",
          title: "ऑनलाइन शीट से जोड़ें",
          subtitle: "Google Sheets के साथ 2-way डेटा सिंक कोड",
          icon: FileSpreadsheet,
          color: "bg-teal-100 text-teal-900",
          action: () => onNavigatePage("apps_script"),
        },
        {
          id: "settings",
          title: "सेटिंग्स",
          subtitle: "दैनिक लक्ष्य, थीम्स, डेटा बैकअप व प्राथमिकताएं",
          icon: Settings,
          color: "bg-stone-100 text-stone-900",
          action: () => onNavigatePage("settings"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Banner with Quick Actions */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
            अतिरिक्त टूल्स व सेटिंग्स
          </h2>
          <p className="text-xs text-stone-500">
            सभी अध्ययन साधन, बैकलॉग प्रबंधन व बैकअप विकल्प
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(6);
            onOpenGemini();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>AI डाउट</span>
        </button>
      </section>

      {/* Categorized Tile Groups */}
      {hubCategories.map((cat) => (
        <section key={cat.group} className="space-y-2">
          <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider px-1">
            {cat.group}
          </h3>

          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {cat.items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    triggerHaptic(6);
                    item.action();
                  }}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* CSV & Excel Export Quick Footer */}
      <section className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-stone-100 rounded-2xl text-xs font-bold text-stone-700">
        <span>रिकॉर्ड व सिलेबस बैकअप</span>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenExportModal && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                onOpenExportModal("all_in_one");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx) व CSV एक्सपोर्ट</span>
            </button>
          )}
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>त्वरित CSV</span>
          </button>
        </div>
      </section>
    </div>
  );
};
