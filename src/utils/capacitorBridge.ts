import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Initializes Capacitor mobile native configurations if running inside Android / iOS app.
 */
export async function initCapacitorMobile() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Configure status bar color and dark style
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1c1917' });
  } catch (err) {
    console.debug('StatusBar setup notice:', err);
  }

  try {
    // Hide splash screen smoothly after app is ready
    await SplashScreen.hide();
  } catch (err) {
    console.debug('SplashScreen setup notice:', err);
  }
}

export interface BackButtonHandlerContext {
  hasOpenModal: boolean;
  closeActiveModal: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedLectureId?: string | null;
  clearSelectedLecture?: () => void;
}

/**
 * Sets up Android physical back-button handling.
 * Modal open -> Close modal
 * Sub-tab open -> Go back to Cockpit / Home
 * On Home -> Exit app
 */
export function setupBackButtonHandler(getContext: () => BackButtonHandlerContext) {
  if (!Capacitor.isNativePlatform()) return () => {};

  const listenerPromise = CapApp.addListener('backButton', ({ canGoBack }) => {
    const ctx = getContext();

    if (ctx.hasOpenModal) {
      ctx.closeActiveModal();
      return;
    }

    if (ctx.selectedLectureId && ctx.clearSelectedLecture) {
      ctx.clearSelectedLecture();
      return;
    }

    if (ctx.activeTab !== 'cockpit' && ctx.activeTab !== 'home') {
      ctx.setActiveTab('cockpit');
      return;
    }

    if (canGoBack) {
      window.history.back();
    } else {
      CapApp.exitApp();
    }
  });

  return () => {
    listenerPromise.then((handle) => handle.remove()).catch(() => {});
  };
}
