import { defineConfig } from '@playwright/test';
import 'dotenv/config';

const env = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: env.BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'retain-on-failure',
  },
});