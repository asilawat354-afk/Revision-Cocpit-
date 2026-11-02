// Mobile tactile haptic vibration utility
export const triggerHaptic = (duration = 10) => {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  } catch {
    // Ignore if not supported
  }
};
