import UnoCSS from 'unocss/vite'
import { sveltekit as SvelteKit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [SvelteKit(), UnoCSS()]
});
