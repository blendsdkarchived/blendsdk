import * as mkdirp from "mkdirp";
import * as path from "path";
import * as fs from "fs";

/**
 * Ensures that a directory exists.
 *
 * @export
 * @param {string} folder
 * @returns
 */
export function ensureFolder(folder: string) {
	if (folder.split(".").length >= 2) {
		folder = folder.substr(0, folder.lastIndexOf(path.sep));
	}
	return mkdirp.sync(folder);
}

/**
 * Fixed a path my correcting the separators
 *
 * @export
 * @param {string} filePath
 * @returns
 */
export function fixPath(filePath: string) {
	return filePath.replace(new RegExp(/\//, "g"), path.sep).replace(new RegExp(/ /, "gi"), "\\ ");
}

export function checkFolderAndContinue(folder: string) {
	return !(fs.existsSync(folder));
}

export function createProjectFolder(projectName: string) {
	return path.join(process.cwd(), projectName);
}

export function util(name: string) {
	return path.resolve(path.join(path.dirname(__filename), "..", "..", "node_modules", ".bin", name));
}