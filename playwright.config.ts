import { defineConfig, devices } from "@playwright/test";

const PORT = 3500;
const baseURL = `http://localhost:${PORT}`;

/**
 * Visual regression via Chromatic. `npx playwright test` writes an archive of
 * each page under test-results/**\/chromatic-archives; `npm run chromatic`
 * uploads them. See e2e/visual.spec.ts.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
    // Match the Figma frame height so the sidebar renders full-length.
    viewport: { width: 1440, height: 1078 },
  },

  projects: [
    // Chromium only: Chromatic re-renders the uploaded archives in its own
    // browsers, so capturing locally in more than one is wasted work.
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],

  webServer: {
    // A production build, not `next dev` — no HMR overlay or dev-only markup
    // leaking into the baselines.
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
