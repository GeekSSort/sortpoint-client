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
    // Signed in. The route guard sends an anonymous visitor to /login, so
    // without this every test asserting on /dashboard measures the login page.
    // These cookies carry no token — the guard is a signpost, and nothing here
    // reaches the API.
    storageState: {
      cookies: [
        { name: "sp_session", value: "1", domain: "localhost", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" as const },
        { name: "sp_scope", value: "full", domain: "localhost", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" as const },
      ],
      origins: [],
    },
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
