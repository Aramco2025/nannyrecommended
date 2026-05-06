import { Browser } from "@capacitor/browser";
import { isNativeApp } from "@/lib/platform";

/**
 * Opens an external URL.
 * - On native (iOS/Android), uses the in-app system browser (SFSafariViewController / Custom Tabs)
 *   so users stay inside our app shell and Apple's review treats it correctly.
 * - On web, opens a new tab.
 */
export async function openExternal(url: string): Promise<void> {
  if (isNativeApp()) {
    await Browser.open({ url });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
