import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atriontechsd.zfit',
  appName: 'Zfit',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
