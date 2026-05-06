import type { CapacitorConfig } from '@capacitor/cli';

/**
 * iOS-only Capacitor configuration.
 *
 * For PRODUCTION (App Store builds):
 *   - Comment out the `server` block below so the bundled `dist/` is used.
 *   - Run: npm run build && npx cap sync ios
 *
 * For DEVELOPMENT (live reload from Lovable sandbox):
 *   - Keep the `server` block as-is.
 */
const config: CapacitorConfig = {
  appId: 'com.nannyrecommended',
  appName: 'NannyRecommended',
  webDir: 'dist',
  // ⚠️ DEV ONLY — remove or comment out before archiving for the App Store.
  server: {
    url: 'https://e1e5d17a-34de-4ddf-a367-ad73ca194925.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
    scheme: 'NannyRecommended',
    limitsNavigationsToAppBoundDomains: true,
    backgroundColor: '#FFFFFF',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body' as any,
    },
  },
};

export default config;
