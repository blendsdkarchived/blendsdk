import * as path from "path";
import * as shell from "shelljs";
import { util } from "../utils/filesystem";

export const command: string = "build:debug";
export const desc: string = "Start the application in development mode";
export const builder: any = {
};

// concurrently -p \"[{name}]\" -n \"TSC,ROLLUP,SERVE\"  \"npm run watch:ts\" \"npm run watch:rollup\" \"npm run serve\

export const handler = () => {
	// tslint:disable-next-line:max-line-length
	shell.exec(`${util("concurrently")} -p "[{name}]" -n \"TYPESCRIPT,ROLLUP\" "${util("tsc")} -w -p ${process.cwd()}" "${util("rollup")} -w -config ${path.join(process.cwd(), "rollup.configs.js")}"`, {
		cwd: process.cwd()
	});
};
