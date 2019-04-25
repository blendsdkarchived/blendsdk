import * as ejs from "ejs";
import { checkFolderAndContinue, createProjectFolder, ensureFolder } from "../utils/filesystem";
import { errorAndExit, logInfo } from "../utils/log";
import { installPackages, npmInstall } from "../utils/packageman";
import { ITemplateItem, renderTemplate } from "../utils/templates";

export const command: string = "app [name]";
export const desc: string = "Create a new BlendSDK application";
export const builder: any = {
	name: {
		required: true,
		desc: "The name of the app to be created."
	}
};

export const handler = (argv: any) => {

	const projectFolder = createProjectFolder(argv.name);
	if (checkFolderAndContinue(projectFolder)) {

		logInfo("Creating the project folder.");
		ensureFolder(projectFolder);

		logInfo("Creating the project files");
		renderTemplate("app/basic", projectFolder, (item: ITemplateItem): ITemplateItem => {
			item.output = ejs.render(item.source, {
				name: argv.name
			});
			return item;
		});

		logInfo("Installing npm packages into the project, this might take a while.");
		installPackages(projectFolder, [
			"@blendsdk/core",
			"@blendsdk/ajax",
			"@blendsdk/application",
			"@blendsdk/blendrunner",
			"@blendsdk/browser",
			"@blendsdk/css",
			"@blendsdk/deviceinfo",
			"@blendsdk/dom",
			"@blendsdk/extensions",
			"@blendsdk/form",
			"@blendsdk/icon",
			"@blendsdk/mvc",
			"@blendsdk/task",
			"@blendsdk/ui",
			"@blendsdk/uistack",
			"@blendsdk/viewrouter"], true);

		npmInstall(projectFolder);
		logInfo("Done");

	} else {
		errorAndExit(`${projectFolder} already exists!`);
	}

};
