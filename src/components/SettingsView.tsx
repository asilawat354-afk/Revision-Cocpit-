import React from "react";
import { SettingsModal, SettingsTabId } from "./SettingsModal";
import { 
  BottomBarStyle, 
  ScreenTransitionEffect, 
  PillSpeedOption, 
  ScrollSensitivity 
} from "./Navbar";
import { SearchDisplayType } from "./CommandPalette";
import { CockpitConfig } from "../types";
import { NavButtonStyle } from "../utils/navButtonStyles";

interface SettingsViewProps {
  onGoBack: () => void;
  backTitle?: string;
  navButtonStyle?: NavButtonStyle;
  onSelectNavButtonStyle?: (style: NavButtonStyle) => void;
  bottomBarStyle: BottomBarStyle;
  onSelectBottomBarStyle: (style: BottomBarStyle) => void;
  screenTransition: ScreenTransitionEffect;
  onSelectScreenTransition: (effect: ScreenTransitionEffect) => void;
  speedMode: PillSpeedOption;
  onSelectSpeedMode: (speed: PillSpeedOption) => void;
  scrollSensitivity: ScrollSensitivity;
  onSelectScrollSensitivity: (sens: ScrollSensitivity) => void;
  searchDisplayType?: SearchDisplayType;
  onSelectSearchDisplayType?: (type: SearchDisplayType) => void;
  config?: CockpitConfig;
  onUpdateConfig?: (newConfig: Partial<CockpitConfig>) => void;
  onOpenDirectory?: () => void;
  onOpenDebtModal?: () => void;
  onExportCSV?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = (props) => {
  return (
    <SettingsModal
      {...props}
      isOpen={true}
      onClose={props.onGoBack}
      isFullPage={true}
    />
  );
};
