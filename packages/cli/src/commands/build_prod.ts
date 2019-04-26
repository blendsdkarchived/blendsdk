// tslint:disable:max-line-length
import * as path from "path";
import * as shell from "shelljs";
import { util } from "../utils/filesystem";
import { errorAndExit } from "../utils/log";

export const command: string = "build:prod";
export const desc: string = "Build the application in production mode";
export const builder: any = {
};

export const handler = () => {

	const commands = [
		`${util("tsc")} -p ${process.cwd()}`,
		`${util("rollup")} --config ${path.join(process.cwd(), "rollup.config.js")}`
	];

	commands.forEach((cmd: string) => {

		const result = shell.exec(cmd, {
			cwd: process.cwd()
		});

		if (result.code !== 0) {
			errorAndExit(result.stderr.toString());
		}
	});
};
