import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { stat } from 'fs/promises';
import path from 'path';
import { SetupTestOptions } from '../utils/customTest';

const homeDir = path.join(__dirname, '..');
dotenv.config({ path: path.resolve(homeDir, '.env') });

const configPath = path.join(homeDir, 'e2e', 'config');
const testPath = path.join(homeDir, 'e2e', 'tests');
const configFile = `${configPath}/usersConfig.json`;
let config;

try {
  async () => await stat(configFile);
  config = require(configFile);
} catch (err) {
  if (err) {
    console.log(`The config cannot be found. Check in ./e2e/config`);
    process.exit(1);
  }
};

const testRunConfig = config[process.env.user || 'not found'];
if (!testRunConfig) {
  console.log('This user does not exist. Please double check in ./e2e/configs');
  process.exit(1);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<SetupTestOptions>({
  testDir: testPath,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: testRunConfig.baseURL,
    testIdAttribute: 'data-test', // Set this to your prefered test-id attribute name
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      use: { username: testRunConfig.username, password: process.env[testRunConfig.password] },
      testDir: path.join(homeDir, 'global'),
      testMatch: /auth-setup.ts/
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json', video: 'retain-on-failure' },
      dependencies: ['setup']
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
