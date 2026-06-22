import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'To-Do',
  webDir: 'dist/frontend/browser',
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false,
      androidDatabaseLocation: 'default'
    }
  }
};

export default config;