import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

export default [
    {
        input: './dist/index.js',
        output: {
            name: 'lib',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        plugins: [resolve(), commonjs(), sourcemaps()]
    },
    {
        input: './dist/index.js',
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true }
        ],
        plugins: [resolve(), sourcemaps()]
    }
];
