import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { load } from "dotenv-extended";
import tsconfigPaths from "vite-tsconfig-paths";

function loadEnv(mode: string) {
  const m = mode === "development" ? "local" : mode;
  const loadedEnv = load({
    path: `env/.env.${m}`,
    schema: "env/.env.schema",
    errorOnMissing: true,
    errorOnExtra: true,
  });

  return loadedEnv;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopmentMode = mode === "development" || mode === "dev";
  const isLocalDevelopmentMode = mode === "development";

  loadEnv(mode);

  return {
    build: {
      sourcemap: true,
    },
    define: {
      IS_PRODUCTION_MODE: `${!isDevelopmentMode}`,
      API_ENDPOINT_URL: `"${process.env["API_ENDPOINT_URL"]}"`,
      CMU_OAUTH_URL: `"${process.env["CMU_OAUTH_URL"]}"`,
      IS_LOCAL_DEVELOPMENT: `${isLocalDevelopmentMode}`,
    },
    server: {
      host: process.env["HOST"] || "127.0.0.1",
      port: Number(process.env["PORT"] || 3001),
      strictPort: true,
    },
    plugins: [react(), tsconfigPaths()],
    test: {
      include: ["**/__tests__/*.ts"],
      environment: "jsdom",
    },
  };
});
