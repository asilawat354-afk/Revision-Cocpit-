import { LectureItem } from "../types";

export type AppScreenId =
  | "home"
  | "cockpit"
  | "heatmap"
  | "audit_grid"
  | "master_db"
  | "more"
  | "subjects_directory"
  | "topic_detail"
  | "mistake_queue"
  | "focus_timer"
  | "notes_editor"
  | "debt_vault"
  | "debt_reset"
  | "settings"
  | "apps_script";

export interface ScreenStackItem {
  screenId: AppScreenId;
  title: string;
  shortTitle: string;
  params?: {
    subjectName?: string;
    chapterName?: string;
    lectureId?: string;
    fromSearch?: boolean;
    fromScreen?: AppScreenId;
    [key: string]: any;
  };
  scrollY?: number;
}

export type OverlayId =
  | "nav_drawer"
  | "search"
  | "revision_session"
  | "add_lecture"
  | "gemini_doubt"
  | "vacation"
  | "custom_revision"
  | "voice_memo"
  | "ecosystem_switcher"
  | "button_style_tester"
  | "confirm_studied"
  | "confirm_reset"
  | "celebration"
  | "exit_confirm"
  | "export_data";

export interface OverlayStackItem {
  id: OverlayId;
  payload?: any;
}

export const SCREEN_METADATA: Record<AppScreenId, { title: string; shortTitle: string; isRootTab?: boolean }> = {
  home: { title: "होम डैशबोर्ड", shortTitle: "होम", isRootTab: true },
  cockpit: { title: "आज का रिवीज़न", shortTitle: "रिवीज़न", isRootTab: true },
  heatmap: { title: "आने वाले 30 दिन का भार", shortTitle: "कैलेंडर", isRootTab: true },
  master_db: { title: "सभी लेक्चर्स की सूची", shortTitle: "डेटाबेस", isRootTab: true },
  more: { title: "अधिक टूल्स व मेन्यू", shortTitle: "अधिक", isRootTab: true },
  audit_grid: { title: "21-दिन अभ्यास प्रगति ग्रिड", shortTitle: "प्रगति" },
  subjects_directory: { title: "विषय एवं अध्याय निर्देशिका", shortTitle: "निर्देशिका" },
  topic_detail: { title: "टॉपिक विवरण व नोट्स", shortTitle: "विवरण" },
  mistake_queue: { title: "कमज़ोर टॉपिक्स व गलतियाँ", shortTitle: "गलतियाँ" },
  focus_timer: { title: "पढ़ाई का टाइमर", shortTitle: "टाइमर" },
  notes_editor: { title: "स्टडी नोट्स व सूत्र बैंक", shortTitle: "नोट्स" },
  debt_vault: { title: "बैकलॉग वॉल्ट", shortTitle: "वॉल्ट" },
  debt_reset: { title: "बैकलॉग छंटाई व रीसेट", shortTitle: "छंटाई" },
  settings: { title: "सेटिंग्स", shortTitle: "सेटिंग्स" },
  apps_script: { title: "ऑनलाइन शीट से जोड़ें", shortTitle: "शीट सिंक" },
};
