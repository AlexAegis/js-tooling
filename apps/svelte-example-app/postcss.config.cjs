/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		'postcss-import': {},
		// postcssImport(),
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss: {},
		//But others, like autoprefixer, need to run after,
		autoprefixer: {},
	},
};

module.exports = config;
