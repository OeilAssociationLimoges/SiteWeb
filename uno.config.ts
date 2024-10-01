import { defineConfig, presetWebFonts, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: "Figtree:300,400",
        mono: "Space Mono"
      }
    })
  ]
});