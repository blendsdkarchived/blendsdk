import * as shell from "shelljs";
import { errorAndExit } from "./log";

/**
 * Installs one or more npm packages either as de or production dependency.
 *
 * @export
 * @param {string} packageFolder
 * @param {string[]} packages
 * @param {boolean} isDev
 */
export function installPackages(packageFolder: string, packages: string[], isDev: boolean) {
	const child = shell.exec(`npm install ${isDev ? "--save-dev" : "--save"} ${packages.join(" ")}`, {
		cwd: packageFolder,
		silent: true
	});
	if (child.code !== 0) {
		errorAndExit(child.stderr.toString());
	}
}

/**
 * Runs `npm install`
 *
 * @export
 * @param {string} packageFolder
 */
export function npmInstall(packageFolder: string) {
	const child = shell.exec(`npm install`, {
		cwd: packageFolder,
		silent: true
	});
	if (child.code !== 0) {
		errorAndExit(child.stderr.toString());
	}
}
