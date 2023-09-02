import transformer_directives from "@unocss/transformer-directives";
import transformer_variant_group from "@unocss/transformer-variant-group";
import { defineConfig } from "unocss";

export default defineConfig({
  shortcuts: {
    "black-ring-white": "outline-none border-2 border-transparent focus:(border-black ring-2 ring-white)"
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
      inter: ["Inter", "sans-serif"]
    }
  },
  transformers: [transformer_directives(), transformer_variant_group()],
});