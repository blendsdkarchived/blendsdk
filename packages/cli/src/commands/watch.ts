// tslint:disable:max-line-length
// tslint:disable:no-console
import * as path from "path";
import * as shell from "shelljs";
import { cleanDistFolder, util } from "../utils/filesystem";
import { errorAndExit } from "../utils/log";

export const command: string = "watch";
export const desc: string = "Only starts the typescript watch mode. This option is only useful for developing libraries.";
export const builder: any = {
};

export const handler = (argv: any) => {

	const commands = [
		`${util("tsc")} -w -p ${process.cwd()}`
	];

	cleanDistFolder(argv.clean);

	commands.forEach((cmd: string) => {

		const result = shell.exec(cmd, {
			cwd: process.cwd()
		});

		console.log(result.stdout);

		if (result.code !== 0) {
			errorAndExit(result.stderr.toString());
		}
	});
};
