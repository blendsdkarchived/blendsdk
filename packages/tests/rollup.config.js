import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import pkg from "./package.json";
import glob from "glob";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";

var build = [
    {
        input: "./.build/index.js",
        output: {
            file: "./public/js/index.js",
            format: "iife",
            sourcemap: true,
            name: "index"
        },
        plugins: [resolve(), commonjs(), sourcemaps()]
    },
    {
        input: "./.build/fiddle.js",
        output: {
            file: "./public/js/fiddle.js",
            format: "iife",
            sourcemap: true,
            name: "index"
        },
        plugins: [resolve(), commonjs(), sourcemaps()]
    }
];

var inBrowserTests = glob.sync(path.join(process.cwd(), ".build", "**", "*.browser.js"));
var template = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="expires" content="0" />
        <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta http-equiv="pragma" content="no-cache" />
        <title>__name__</title>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
            *,
            *::before,
            *::after {
                box-sizing: border-box;
            }
        </style>
        <script src="__script__"></script>
    </head>
    <body></body>
</html>
`;

let projectRoot = process.cwd();
let browserFolder = path.join(projectRoot, "public", "browser");

inBrowserTests.forEach(function(jsfile) {
    var outFileName = jsfile
        .replace(path.join(projectRoot, ".build") + path.sep, "")
        .replace(/\.browser\.js/gi, "")
        .replace(new RegExp(path.sep + "|\\.", "g"), "_")
        .toLowerCase();
    build.push({
        input: jsfile,
        output: {
            file: "./public/js/" + outFileName + ".js",
            format: "iife",
            sourcemap: true,
            name: "test"
        },
        plugins: [
            resolve(), // tells Rollup how to find date-fns in node_modules
            commonjs() // converts date-fns to ES modules
            //sourcemaps()
        ]
    });

    mkdirp.sync(browserFolder);
    fs.writeFileSync(
        path.join(browserFolder, outFileName + ".html"),
        template.replace("__name__", outFileName).replace("__script__", "../js/" + outFileName + ".js")
    );
});

export default build;
