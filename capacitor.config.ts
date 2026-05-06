import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e1e5d17a34de4ddfa367ad73ca194925',
  appName: 'nannyrecommended',
  webDir: 'dist',
  server: {
    // Hot-reload from the Lovable sandbox during development.
    // Remove or replace with a production URL before submitting to the stores.
    url: 'https://e1e5d17a-34de-4ddf-a367-ad73ca194925.lovableproject.com?forceHideBadge=true',
    cleartext: true,
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
