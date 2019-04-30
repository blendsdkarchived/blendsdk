// tslint:disable:max-line-length
import * as fs from "fs";
import * as path from "path";
import * as shell from "shelljs";
import { isArray } from "../utils/common";
import { cleanDistFolder, util } from "../utils/filesystem";
import { errorAndExit, logInfo } from "../utils/log";

export const command: string = "build:dev [clean]";
export const desc: string = "Build the application in development mode";
export const builder: any = {
};

export const handler = (argv: any) => {

	const rollupConfig = path.join(process.cwd(), "rollup.config.js");

	const commands = [
		`${util("tsc")} -p ${process.cwd()}`,
		[rollupConfig, `${util("rollup")} --config ${rollupConfig} --environment BUILD:development`]
	];

	cleanDistFolder(argv.clean);

	commands.forEach((cmd: string) => {
		if (isArray(cmd)) {
			if (fs.existsSync(cmd[0])) {
				cmd = cmd[1];
			} else {
				cmd = null;
			}
		}

		if (cmd) {
			const result = shell.exec(cmd, {
				cwd: process.cwd()
			});

			if (result.code !== 0) {
				errorAndExit(result.stderr.toString());
			}
		}
	});
};
