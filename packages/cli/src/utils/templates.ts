// tslint:disable:no-console
import * as ejs from "ejs";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import { fixPath, ensureFolder } from './filesystem';

export interface ITemplateItem {
	source: string;
	fileName: string;
	output: any;
}

export type TTemplateHandler = (item: ITemplateItem) => ITemplateItem;

function getTemplateFolder(name: string) {
	return path.join(path.dirname(__filename), "..", "..", "templates", fixPath(name));
}

function getTemplate(template: string): ITemplateItem[] {
	const folder = getTemplateFolder(template),
		files = glob.sync(folder + path.sep + "**", {
			nodir: true
		}),
		tmpl: ITemplateItem[] = [];
	files.forEach(file => {
		tmpl.push({
			source: fs.readFileSync(file, "utf-8"),
			fileName: file.replace(folder + path.sep, ""),
			output: null
		});
	});
	return tmpl;
}

export function renderTemplate(template: string, outputFolder: string, handler: TTemplateHandler) {
	const tmpl = getTemplate(template);
	tmpl.forEach(item => {
		const rendered = handler(item);
		if (rendered) {
			const outFile = path.join(outputFolder, rendered.fileName);
			ensureFolder(outFile);
			fs.writeFileSync(outFile, rendered.output);
		}
	});
}
