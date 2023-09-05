import transformer_directives from "@unocss/transformer-directives";
import transformer_variant_group from "@unocss/transformer-variant-group";
import { defineConfig } from "unocss/vite";

export default defineConfig({
  shortcuts: {
    "black-ring-white": "outline-none border-2 border-transparent focus:(border-black ring-2 ring-white)",
    button: "h-10 min-h-10 outline-none border-2 font-medium focus:(ring-2 ring-white)",
		"button--zinc": "bg-transparent border-zinc-800 text-zinc-100 hover:bg-zinc-800"
  },
  theme: {
    colors: {
      "default-text-color": "#DCDCDC",
      "screen-name-color": "#ADADAD",
      "top-color": "#FFFFFF",
      "bottom-color": "#000000",
      "inactive-sidebar-link": "#3C3C3C",
      "datetime-color": "#4B4B4B",
      "separator-horizontal": "#101010",
      "separator-vertical": "#1E1E1E",
      "background-color": "#0C0C0C",
      "dialog-color": "#181818",
    },
    fontFamily: {
      victor: ["Victor Mono", "monospace"],
      poppins: ["Poppins", "sans-serif"]
    }
  },
  transformers: [transformer_directives(), transformer_variant_group()],
});