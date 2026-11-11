import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		// GitHub Pages serves project sites from /<repo-name>
		paths: { base: process.env.BASE_PATH ?? '' }
	}
};
