import { isNativeApp, nativePlatform } from "@/lib/platform";

/**
 * Initialise Capacitor plugins on app boot.
 * Safe to call on web — no-ops if not running natively.
 */
export async function initNative(): Promise<void> {
  if (!isNativeApp()) return;

  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Light });
    if (nativePlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
    }
  } catch (e) {
    console.warn("StatusBar init failed", e);
  }

  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (e) {
    console.warn("SplashScreen hide failed", e);
  }

  try {
    const { Keyboard } = await import("@capacitor/keyboard");
    await Keyboard.setAccessoryBarVisible({ isVisible: true });
  } catch {
    /* keyboard plugin is optional */
  }
}
