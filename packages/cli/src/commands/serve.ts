// tslint:disable:max-line-length
import * as path from "path";
import * as shell from "shelljs";
import { util } from "../utils/filesystem";
import { errorAndExit } from "../utils/log";

export const command: string = "serve";
export const desc: string = "Start the application in development mode";
export const builder: any = {
};

export const handler = () => {

	const cmds = {
		"TypeScript": `"${util("tsc")} -w -p ${process.cwd()}"`,
		"Rollup": `"${util("rollup")} -w --config ${path.join(process.cwd(), "rollup.config.js")} --environment BUILD:development"`
	};

	const options = [
		` -p "[{name}]"`,
		`-n "${Object.keys(cmds).join(",")}"`,
		`${Object.values(cmds).join(" ")}`,
	];

	const commands = [
		`${util("tsc")} -p ${process.cwd()}`,
		`${util("rollup")} --config ${path.join(process.cwd(), "rollup.config.js")} --environment BUILD:development`,
		`${util("concurrently")} ${options.join(" ")}`
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
