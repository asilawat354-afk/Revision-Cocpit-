import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

/**
 * Checks if the application is running inside a native mobile wrapper (Android / iOS)
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Configures Status Bar and Splash Screen for native mobile shell
 */
export const initializeNativeMobile = async () => {
  if (!isNative()) return;

  try {
    // Configure dark theme status bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#1c1917" });
  } catch (err) {
    console.debug("Status bar initialization note:", err);
  }

  try {
    // Hide splash screen smoothly after app initialization
    setTimeout(async () => {
      await SplashScreen.hide();
    }, 600);
  } catch (err) {
    console.debug("Splash screen note:", err);
  }
};

/**
 * Registers Android Hardware Back Button listener
 */
export const registerBackButtonHandler = (
  handleBackAction: () => boolean
) => {
  if (!isNative()) return () => {};

  const listenerPromise = CapApp.addListener("backButton", (event) => {
    // If handleBackAction returns true, the back event was consumed (e.g., closed modal/drawer)
    const consumed = handleBackAction();
    if (!consumed) {
      if (event.canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    }
  });

  return () => {
    listenerPromise.then((handle) => handle.remove()).catch(() => {});
  };
};

/**
 * Helper to get the correct API Base URL
 * In Web browser: uses relative "" (/api/...)
 * In Native Android: uses configured VITE_API_URL or fallback
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined" && (window as any).__SMART_COCKPIT_API_URL__) {
    return (window as any).__SMART_COCKPIT_API_URL__;
  }
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  return "";
};
