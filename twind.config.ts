import { defineConfig } from "twind";
import presetAutoPrefix from "twind-preset-autoprefix";
import presetTailWind from "twind-preset-tailwind";
import { Options } from "twind_fresh_plugin/twind.ts";

export default {
  ...defineConfig({
    presets: [presetAutoPrefix(), presetTailWind()],
    theme: {
      extend: {
        boxShadow: {
          "google": "0 1px 6px rgba(32,33,36,.28)",
        },
      },
    },
  }),
  selfURL: import.meta.url,
} as unknown as Options;
