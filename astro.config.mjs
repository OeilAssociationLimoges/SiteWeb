// @ts-check
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import unocss from "unocss/astro";

import icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  output: "server",
  adapter: vercel(),

  integrations: [
    unocss({
      injectReset: true
    })
  ],

  vite: {
    plugins: [
      yaml(),
      
      icons({
        compiler: "astro",
        customCollections: {
          "local": FileSystemIconLoader("./assets/icons")
        }
      })
    ]
  }
});
