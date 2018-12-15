// tslint:disable:object-literal-key-quotes
import { IUIComponentConfig, UIComponent } from "@blendsdk/ui";
export namespace Assets {
    export class RenderOnly extends UIComponent<IUIComponentConfig> {
        protected render(): HTMLElement {
            return this.createElement({
                css: "ui-render-only",
                textContent: "RenderOnly"
            });
        }

        protected doLayout(isInitial?: boolean): void {
            // no-op
        }
    }
    export class Rect extends UIComponent<IUIComponentConfig> {
        protected render(): HTMLElement {
            return this.createElement({
                style: {
                    position: "absolute",
                    border: "1px solid #AB47BC",
                    "background-color": "green",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "box-sizing": "border-box"
                },
                css: "ui-rect",
                textContent: "Rect"
            });
        }

        protected doLayout(isInitial?: boolean): void {
            // no-op
        }
    }
}
