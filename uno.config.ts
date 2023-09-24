import transformer_directives from "@unocss/transformer-directives";
import transformer_variant_group from "@unocss/transformer-variant-group";
import { defineConfig } from "unocss/vite";

export default defineConfig({
  shortcuts: {
    "absolute-center": "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "backdrop": "fixed inset-0 bg-separator-horizontal/75 backdrop-filter backdrop-blur-sm",
    "black-ring-white": "outline-none border-2 border-transparent focus:(border-black ring-2 ring-white)",
    // buttons
    "button": "h-36px | flex items-center justify-center outline-none | rounded-lg font-medium",
    "button--square": "w-36px min-w-36px | bg-input-color focus:(ring-2 ring-white)",
    "button--border": "px-28px | bg-transparent ring-2 ring-datetime-color focus:(ring-white)",
    "button--top": "px-28px | bg-top-color border-2 border-transparent text-background-color focus:(border-black ring-2 ring-white)",
  },
  safelist: ["text-lime-400", "text-orange-400"],
  theme: {
    colors: {
      "default-text-color": "#DCDCDC",
      "screen-name-color": "#989898",
      "top-color": "#FFFFFF",
      "bottom-color": "#000000",
      "inactive-sidebar-link": "#3C3C3C",
      "datetime-color": "#4B4B4B",
      "separator-horizontal": "#121212",
      "separator-vertical": "#1E1E1E",
      "background-color": "#0C0C0C",
      "dialog-color": "#181818",
      "input-color": "#202020",
      "input-icon-box-color": "#2A2A2A",
    },
    fontFamily: {
      victor: ["Victor Mono", "monospace"],
      poppins: ["Poppins", "sans-serif"]
    }
  },
  transformers: [transformer_directives(), transformer_variant_group()],
});