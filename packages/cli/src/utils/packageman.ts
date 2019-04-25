import * as shell from "shelljs";
import { errorAndExit } from "./log";

export function installPackages(packageFolder: string, packages: string[], isDev: boolean) {
	const child = shell.exec(`npm install ${isDev ? "--save-dev" : "--save"} ${packages.join(" ")}`, {
		cwd: packageFolder,
		silent: true
	});
	if (child.code !== 0) {
		errorAndExit(child.stderr.toString());
	}
}

export function npmInstall(packageFolder: string) {
	const child = shell.exec(`npm install`, {
		cwd: packageFolder,
		silent: true
	});
	if (child.code !== 0) {
		errorAndExit(child.stderr.toString());
	}
}
