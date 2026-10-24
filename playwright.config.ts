import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4197', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure', channel: process.env.PW_CHANNEL },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : { command: 'npm run dev -- --port 4197 --strictPort', url: 'http://127.0.0.1:4197', reuseExistingServer: !process.env.CI },
});
