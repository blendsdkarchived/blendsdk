import { Component, IComponentConfig, TComponent } from "@blendsdk/core";
import { Controller, ControllerAction, IMVCComponentConfig, MVCComponent, TComponentEvent } from "@blendsdk/mvc";

export namespace Assets {
    export interface IComponentOneConfig extends IMVCComponentConfig {
        someNumber?: number;
        someNumberMirror?: number;
        onNumberSet?: TComponentEvent;
    }

    export class ControllerOne extends Controller {
        @ControllerAction
        public doWork(sender: ComponentOne, value: number) {
            sender.someNumberMirror = value;
        }
    }

    export class ComponentOne extends MVCComponent<IComponentOneConfig> {
        public constructor(config?: IComponentOneConfig) {
            super(config);
            this.configDefaults({
                someNumber: 1,
                someNumberMirror: 0
            });
        }

        public set someNumber(value: number) {
            this.config.someNumber = value;
            this.dispatchEvent("onNumberSet", [value]);
        }

        public get someNumber(): number {
            return this.config.someNumber;
        }

        public set someNumberMirror(value: number) {
            this.config.someNumberMirror = value;
        }

        public get bothNumbers(): string {
            return `${this.config.someNumber}-${this.config.someNumberMirror}`;
        }
    }

    export interface ITickerConfig extends IMVCComponentConfig {
        onTick: TComponentEvent;
    }

    export class CounterController extends Controller {
        protected count: number;

        public get Count() {
            return this.count;
        }

        @ControllerAction
        public onCount(sender: any, value: number) {
            this.count += 1;
        }
    }

    export class Ticker extends MVCComponent<ITickerConfig> {
        public constructor(config?: ITickerConfig) {
            super(config);
        }

        public tick() {
            this.dispatchEvent("onTick");
        }
    }
}
