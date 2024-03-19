import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
// Takes too long to build, especially with image library
import compress from "astro-compress";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://jsfarrell.com",
  integrations: [
    mdx(),
    sitemap(),
    compress({
      // css: true,
      html: true,
      js: true,
      img: false,
      svg: false,
    }),
    prefetch(),
  ],
});
