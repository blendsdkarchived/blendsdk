#!/usr/bin/env node
require("colors");
const fs = require("fs");
const semver = require("semver");
const path = require("path");
const yesno = require("yesno");
const shell = require("shelljs");
const bumpVersion = require("semver-increment");

const argv = process.argv;
const package = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
const versions = {
    patch: [0, 0, 1],
    minor: [0, 1, 0],
    major: [1, 0, 0]
};
const vtypes = Object.keys(versions);

function help() {
    console.error(`Please provide a version type: ${vtypes.join(", ")}`.cyan);
}

if (argv.length !== 3) {
    help();
    process.exit(1);
}

const vtype = argv[2];
if (vtypes.indexOf(vtype) === -1) {
    console.error(`Invaid version type ${vtype}!`.red);
    help();
    process.exit();
}

const version = bumpVersion(versions[vtype], package.version);

function patchFiles(version) {
    const files = [path.join(process.cwd(), "packages", "core", "src", "Version.ts")];

    files.forEach(file => {
        let content = fs.readFileSync(file).toString();
        ["devel", package.version].forEach(str => {
            content = content.replace(str, version);
        });
        console.log(`Patching: ${file}`.yellow);
        fs.writeFileSync(file, content);
    });

    return true;
}

function isGitClean() {
    return shell.exec("git status --porcelain", { silent: true }).stdout.toString().length === 0;
}

function createReleaseBranch(version) {
    const branch = `release-${version}`;
    if (shell.exec(`git checkout -b ${branch}`).code === 0) {
        return branch;
    } else {
        throw new Error(`Unable to create a release branch ${version}`);
    }
}

if (isGitClean()) {
    const branch = createReleaseBranch(version);
    patchFiles(version);
} else {
    console.log(`Working directory is not clean!`.red);
    process.emit(1);
}

// yesno.ask(`Publishing version ${version}. Are you sure? (y/N): `.cyan, false, ok => {
//     if (ok) {
//         if (patchFiles(version)) {
//             if (shell.exec("npm run build").code === 0) {
//                 if (shell.exec("git add .").code === 0) {
//                     if (shell.exec(`git commit -a -m"Patched version ${version}"`).code === 0) {
//                     }
//                 }
//                 console.log("DONE");
//             }
//         }
//     }
// });
