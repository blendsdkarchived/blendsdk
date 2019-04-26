// tslint:disable:max-line-length
// tslint:disable:no-console
import * as path from "path";
import * as shell from "shelljs";
import { util } from "../utils/filesystem";
import { errorAndExit } from "../utils/log";

export const command: string = "serve [port]";
export const desc: string = "Start the application in development mode";
export const builder: any = {
};

export const handler = (argv: any) => {

	const cmds = {
		"TSC": `"${util("tsc")} --preserveWatchOutput -w -p ${process.cwd()}"`,
		"BUILD": `"${util("rollup")} -w --config ${path.join(process.cwd(), "rollup.config.js")} --environment BUILD:development"`,
		"SERVE": `"${util("serve")} --config ${path.join(process.cwd(), "serve.json")} ${argv.port ? `-l ${argv.port}` : ""}"`,
	};

	const options = [
		`-p "[{name}]"`,
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

		console.log(result.stdout);

		if (result.code !== 0) {
			errorAndExit(result.stderr.toString());
		}
	});
};
