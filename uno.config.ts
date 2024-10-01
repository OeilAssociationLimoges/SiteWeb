import { defineConfig, presetWebFonts, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: "Figtree:300,400,500,700,800",
        mono: "Space Mono"
      }
    })
  ]
});