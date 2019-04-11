import { Blend, Component, IComponentConfig } from "@blendsdk/core";

export namespace Assets {
	export interface ITestPersonConfig extends IComponentConfig {
		name?: string;
	}

	export class TestComponent extends Component { }

	export class Person extends Component {
		protected config: ITestPersonConfig;

		public constructor(config?: ITestPersonConfig) {
			super(config);
			const me = this;
			me.configDefaults({
				name: "No Name!"
			} as ITestPersonConfig);
		}

		public getName(): string {
			return this.config.name;
		}
	}

	export class Greeter extends Component {
		public sayHello(name: string) {
			return "Hello " + (name || "");
		}
	}
}
