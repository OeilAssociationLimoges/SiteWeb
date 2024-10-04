// @ts-check
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import unocss from "unocss/astro";

import icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import yaml from '@rollup/plugin-yaml';

import solidJs from "@astrojs/solid-js";

export default defineConfig({
  output: "server",
  adapter: vercel({
    functionPerRoute: false
  }),

  integrations: [unocss({
    injectReset: true
  }), solidJs()],

  vite: {
    plugins: [
      yaml(),
      
      icons({
        compiler: "solid",
        customCollections: {
          "local": FileSystemIconLoader("./assets/icons")
        }
      })
    ]
  }
});