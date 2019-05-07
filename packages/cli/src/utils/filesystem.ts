import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as rimraf from "rimraf";
import { logInfo, logWarn } from "./log";

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

/**
 * Checks if a given folder is not created yet.
 *
 * @export
 * @param {string} folder
 * @returns
 */
export function checkFolderAndContinue(folder: string) {
	return !(fs.existsSync(folder));
}

/**
 * Creates the project folder.
 *
 * @export
 * @param {string} projectName
 * @returns
 */
export function createProjectFolder(projectName: string) {
	return path.join(process.cwd(), projectName);
}

/**
 * Get the full path of a .bin utility to be run by a shelljs.exe call.
 *
 * @export
 * @param {string} name
 * @returns
 */
export function util(name: string) {
	return path.resolve(path.join(path.dirname(__filename), "..", "..", "node_modules", ".bin", name));
}

/**
 * Checks and cleans the distribution folder.
 *
 * @export
 * @param {string} [distFolder]
 */
export function cleanDistFolder(distFolder?: string) {

	const folders = [
		distFolder,
		path.join(process.cwd(), ".tsbuild")
	];

	folders.forEach((folder) => {
		if (folder && fs.existsSync(folder)) {
			try {
				logInfo(`Cleaning ${folder}`);
				rimraf.sync(folder);
			} catch (e) {
				logWarn(e);
			}
		}
	});
}
