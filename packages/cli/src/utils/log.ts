// tslint:disable:no-console
import chalk from "chalk";

/**
 * Logs an error message and exits the application.
 *
 * @export
 * @param {string} message
 */
export function errorAndExit(message: string) {
	console.log(chalk.red("ERROR: ") + message);
	process.exit(1);
}

/**
 * Logs a info message.
 *
 * @export
 * @param {string} message
 */
export function logInfo(message: string) {
	console.log(chalk.cyan("INFO: ") + message);
}

/**
 * Log a warning message.
 *
 * @export
 * @param {string} message
 */
export function logWarn(message: string) {
	console.log(chalk.cyan("WARN: ") + message);
}
