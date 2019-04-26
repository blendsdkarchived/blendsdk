import resolve from "rollup-plugin-node-resolve-magic";
import commonjs from "rollup-plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import { uglify } from "rollup-plugin-uglify";
import sass from 'rollup-plugin-sass';

/**
 * Options to configure the SASS plugin
 * https://github.com/differui/rollup-plugin-sass
 */
const sassOptions = {
	output: true
}

const build = {
	development: {
		input: "./.tsbuild/index.js",
		output: {
			file: "./public/js/app.js",
			format: "iife",
			sourcemap: true,
			name: "index"
		},
		plugins: [sass(sassOptions), resolve(), commonjs(), sourcemaps()]
	},
	production: {
		input: "./.tsbuild/index.js",
		output: {
			file: "./public/js/app.js",
			format: "iife",
			sourcemap: false,
			name: "index"
		},
		plugins: [sass(sassOptions), resolve(), commonjs(), uglify()]
	}
};

export default build[process.env.BUILD || 'production'];
