import React, { useState } from "react";
import { 
  X, 
  Plus, 
  Check, 
  Search, 
  Compass, 
  Sparkles, 
  Database, 
  Layers
} from "lucide-react";
import { FEATURE_CATALOG, FeatureDefinition, FeatureContext } from "../data/featureCatalog";
import { DashboardTile } from "../types";

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTiles: DashboardTile[];
  context: FeatureContext;
  onAddFeature: (featureId: string) => void;
}

export const AddFeatureModal: React.FC<AddFeatureModalProps> = ({
  isOpen,
  onClose,
  existingTiles,
  context,
  onAddFeature,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  const existingFeatureIds = new Set(existingTiles.map((t) => t.featureId));
  const allFeatures = Object.values(FEATURE_CATALOG);

  const categories = ["ALL", "कोर रिवीज़न", "लाइब्रेरी", "योजना व लक्ष्य", "AI सहायता", "टूल्स व सेटिंग्स"];

  const filteredFeatures = allFeatures.filter((f) => {
    const matchesCategory = selectedCategory === "ALL" || f.category === selectedCategory;
    const matchesSearch = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[750px] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-stone-950 shadow-2xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 leading-tight">
                होम स्क्रीन पर नया फ़ीचर जोड़ें
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Quick Settings टाइल के रूप में जोड़ने के लिए फ़ीचर चुनें
              </p>
            </div>
          </div>

          <button
            id="btn-close-add-feature"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-stone-100 bg-white space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="फ़ीचर खोजें (जैसे: रिवीज़न, AI, कैलेंडर, नोट्स)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-100 text-sm font-medium text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat === "ALL" ? "सभी फ़ीचर्स" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feature List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredFeatures.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs font-medium">
              कोई फ़ीचर नहीं मिला
            </div>
          ) : (
            filteredFeatures.map((feat) => {
              const isAlreadyAdded = existingFeatureIds.has(feat.id);

              return (
                <div
                  key={feat.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isAlreadyAdded
                      ? "bg-stone-50/80 border-stone-200/80 opacity-75"
                      : "bg-white border-stone-200 hover:border-amber-400 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-xl shrink-0 ${feat.colorScheme.iconBg} ${feat.colorScheme.iconColor} shadow-2xs`}>
                      {feat.getIcon(context)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {feat.title}
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold shrink-0">
                          {feat.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium truncate mt-0.5">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isAlreadyAdded ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>जोड़ा हुआ</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onAddFeature(feat.id);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>जोड़ें</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
