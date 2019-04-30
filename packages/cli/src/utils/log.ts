// tslint:disable:no-console
import chalk from "chalk";

export function errorAndExit(message: string) {
	console.log(chalk.red("ERROR: ") + message);
	process.exit(1);
}

export function logInfo(message: string) {
	console.log(chalk.cyan("INFO: ") + message);
}

export function logWarn(message: string) {
	console.log(chalk.cyan("WARN: ") + message);
}
