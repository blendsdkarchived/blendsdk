import { Application } from "@blendsdk/application";
import { Placeholder } from "@blendsdk/ui";

// tslint:disable-next-line:no-unused-expression
new Application({
	mainView: new Placeholder({
		caption: "Hello BlendSDK",
		styles: {
			backgroundColor: "#FFFFFF",
			color: "#000"
		}
	})
});
