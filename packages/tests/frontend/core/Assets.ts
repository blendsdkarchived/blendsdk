import { IComponentConfig, Blend, Component } from '@blendsdk/core';

export namespace Assets {
    export interface ITestPersonConfig extends IComponentConfig {
        name?: string;
    }

    export class TestComponent extends Component {}

    export class Person extends Component {
        protected config: ITestPersonConfig;

        public getName(): string {
            return this.config.name;
        }

        public constructor(config?: ITestPersonConfig) {
            super(config);
            var me = this;
            me.configDefaults(<ITestPersonConfig>{
                name: 'No Name!'
            });
        }
    }

    export class Greeter extends Component {
        public sayHello(name: string) {
            return 'Hello ' + (name || '');
        }
    }
}
