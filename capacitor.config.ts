
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aa852ffaf28f4492b2655fa6959db14a',
  appName: 'fit-fuse-platform',
  webDir: 'dist',
  server: {
    url: 'https://aa852ffa-f28f-4492-b265-5fa6959db14a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#4F46E5",
    }
  }
};

export default config;
