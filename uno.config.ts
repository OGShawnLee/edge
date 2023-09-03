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
      zinc: {
        1000: "#121217",
        900: "#18181B",
        800: "#212127",
        700: "#2A2A37",
        600: "#414158",
        500: "#818198",
        400: "#9F9FAD",
        300: "#CACACE",
        200: "#D7D7DB",
        100: "#E4E4E7",
      },
    },
    fontFamily: {
      victor: ["Victor Mono", "monospace"],
      roboto: ["Roboto", "sans-serif"]
    }
  },
  transformers: [transformer_directives(), transformer_variant_group()],
});