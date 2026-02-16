import path from "node:path";
import { defineConfig, devices } from "playwright/test";

const repoRoot = path.resolve(__dirname, "..", "..");

export default defineConfig({
  testDir: __dirname,
  testMatch: ["smoke.spec.ts", "core-flow/**/*.spec.ts"],
  timeout: 45_000,
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "python -m uvicorn app.main:app --host 127.0.0.1 --port 8001",
      cwd: path.join(repoRoot, "backend"),
      port: 8001,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 5173",
      cwd: path.join(repoRoot, "frontend"),
      port: 5173,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});

