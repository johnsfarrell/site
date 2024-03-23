import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import { defineConfig } from "astro/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://johnfarrell.io",
  integrations: [
    mdx(),
    sitemap(),
    compress({
      css: true,
      html: true,
      js: true,
      img: false,
      svg: false,
    }),
    prefetch(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [() => rehypeKatex({ strict: false })],
  },
});
