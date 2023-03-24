import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [preprocess(
		{
			postcss: true,
		}
	)],

	kit: {
		prerender: {
            entries: [
				"/",
                "/course/[courseid]",
				"/lab/[courseid]/[...loid]",
				"/note/[courseid]/[...loid]",
				"/talk/[courseid]/[...loid]",
				"/topic/[courseid]/[...loid]",
				"/video/[courseid]/[...loid]",
				"/wall/[type]/[courseid]"
            ],
        },
		adapter: adapter(
			{strict: false}
		)
	}
};

export default config;
