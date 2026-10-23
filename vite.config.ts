import vinext from "vinext";
import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/postcss";

// Sites: atribuição e licença em docs/THIRD_PARTY_NOTICES.md.
/** Inclui no build o manifesto usado para publicar o app no Sites. */
function sites(): Plugin {
  let projectRoot = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      projectRoot = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(projectRoot, "dist", ".openai");
      await mkdir(outputDirectory, { recursive: true });
      await copyFile(
        resolve(projectRoot, ".openai", "hosting.json"),
        resolve(outputDirectory, "hosting.json"),
      );
    },
  };
}

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    vinext(),
    sites(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      inspectorPort: false,
      config: {
        main: "vinext/server/fetch-handler",
        compatibility_flags: ["nodejs_compat"],
      },
    }),
  ],
});
