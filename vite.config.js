import { defineConfig } from 'vite';

import { viteStaticCopy } from "vite-plugin-static-copy";
export default defineConfig({
  base: "/color-glyphs/",
  plugins: [viteStaticCopy({
    targets: [
      { src: ".purview_helper.js", dest: "" },
      { src: "grayglyph.js", dest: "" },
      { src: "spotglyph.js", dest: "" },
      { src: "sketch.js", dest: "" },
      { src: "sketch2.js", dest: "" },
      { src: "glyph.js", dest: "" },
      { src: "preview.jpg", dest: "" },
      { src: "thumbnail.png", dest: "" },
      { src: "twemoji36b_montage.png", dest: "" },
      { src: "sketch.html", dest: "" },
      { src: ".nojekyll", dest: "" }
    ]
  })]
});
