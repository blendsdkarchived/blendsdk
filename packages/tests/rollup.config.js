import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { uglify } from 'rollup-plugin-uglify';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: './.build/index.js',
        output: {
            file: './public/js/index.js',
            format: 'iife',
            sourcemap: true,
            name: 'index'
        },
        plugins: [
            resolve(),
            commonjs(),
            sourcemaps(),
            production && uglify({ sourcemap: true }) // minify, but only in production
        ]
    }
];
