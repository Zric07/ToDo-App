import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ToDo',
  webDir: 'dist/frontend/browser',
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false,
      androidDatabaseLocation: 'default'
    }
  }
};

export default config;