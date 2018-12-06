import { BLEND_RUNNER_VERSION } from "./Version";

export function showPlash(): any {
	var welcome =
		" ____  _                _ ____                              \n" +
		"| __ )| | ___ _ __   __| |  _ \\ _   _ _ __  _ __   ___ _ __ \n" +
		"|  _ \\| |/ _ \\ '_ \\ / _` | |_) | | | | '_ \\| '_ \\ / _ \\ '__|\n" +
		"| |_) | |  __/ | | | (_| |  _ <| |_| | | | | | | |  __/ |   \n" +
		"|____/|_|\\___|_| |_|\\__,_|_| \\_\\\\__,_|_| |_|_| |_|\\___|_|   \n\n" +
		`BlendRunner Version: ${BLEND_RUNNER_VERSION}`;
	console.log(welcome);
}