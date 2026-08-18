import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Standard Vite config for the Civic Sathi citizen portal (TanStack Start + React 19).
// This app deploys to Vercel: the `nitro` plugin builds the SSR server (auth
// gate, complaint routes, server functions) into Vercel's serverless output.
export default defineConfig(({ mode, command }) => {
  // Inline VITE_*-prefixed env vars at build time so they're available inside
  // the server bundle too, not just client code (Vite does this automatically
  // for client code, but the SSR/server build needs it made explicit).
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      // Prevents duplicate React/React Query instances across dependencies,
      // which otherwise shows up as "invalid hook call" or broken context.
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 8080,
      watch: {
        // Avoids double-triggered HMR when an editor writes a file in steps.
        awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
      },
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      // Nitro is only needed to produce the deployable server build.
      ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
      viteReact(),
    ],
  };
});
