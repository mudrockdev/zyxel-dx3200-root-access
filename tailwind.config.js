/** @type {import('tailwindcss').Config} */
import * as daisyui from 'daisyui';
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['black']
	},
	plugins: [daisyui]
};
