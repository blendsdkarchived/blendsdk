import resolve from "rollup-plugin-node-resolve-magic";
import commonjs from "rollup-plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import { uglify } from "rollup-plugin-uglify";

const build = {
	development: {
		input: "./.tsbuild/index.js",
		output: {
			file: "./public/js/app.js",
			format: "iife",
			sourcemap: true,
			name: "index"
		},
		plugins: [resolve(), commonjs(), sourcemaps()]
	},
	production: {
		input: "./.tsbuild/index.js",
		output: {
			file: "./public/js/app.js",
			format: "iife",
			sourcemap: false,
			name: "index"
		},
		plugins: [resolve(), commonjs(), uglify()]
	}
};

export default build[process.env.BUILD || 'production'];
