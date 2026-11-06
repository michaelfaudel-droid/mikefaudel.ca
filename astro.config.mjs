import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.mikefaudel.ca",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    mdx(),
    // The styleguide is an internal reference page, so keep it out of search.
    sitemap({ filter: (page) => !page.includes("/styleguide") }),
  ],
});
