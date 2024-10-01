// @ts-check
import { defineConfig } from 'astro/config';
import unocss from "unocss/astro";

import icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
  integrations: [
    unocss({
      injectReset: true
    })
  ],

  vite: {
    plugins: [
      icons({
        compiler: "astro",
        customCollections: {
          "local": FileSystemIconLoader("./assets/icons")
        }
      })
    ]
  }
});
