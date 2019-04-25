import resolve from "rollup-plugin-node-resolve-magic";
import commonjs from "rollup-plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";

var build = [
	{
		input: "./.build/index.js",
		output: {
			file: "./public/js/app.js",
			format: "iife",
			sourcemap: true,
			name: "index"
		},
		plugins: [resolve(), commonjs(), sourcemaps()]
	}
];

export default build;
