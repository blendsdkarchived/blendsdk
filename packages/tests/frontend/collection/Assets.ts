import { Blend, Collection, Component, IComponentConfig } from "@blendsdk/core";

export namespace Assets.collection {
    export interface ISimpleObjectConfig extends IComponentConfig {
        id: string;
    }

    export class SimpleObject extends Component {
        public constructor(config?: ISimpleObjectConfig) {
            super(config);
            this.config.id = this.config.id || Blend.ID().toString();
        }

        public getId(): string {
            return this.config.id;
        }

        public hasId(value: string): boolean {
            return this.config.id === value;
        }
    }

    export class SimpleCollection extends Collection<SimpleObject> {
        public addSimple(id: string) {
            const me = this;
            id.split("").forEach(item => {
                return me.add(new SimpleObject({ id: item }));
            });
        }

        public newItem(id: string): SimpleObject {
            return new SimpleObject({ id });
        }

        public getIds(): string {
            const me = this,
                result: string[] = [];
            me.forEach(item => {
                result.push(item.getId());
            });
            return result.join("");
        }
    }
}
