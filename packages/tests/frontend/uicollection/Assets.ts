import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { CSS, stylesheet } from "@blendsdk/css";
import { IUICollectionConfig, IUIComponentStyles, Placeholder, UICollection } from "@blendsdk/ui";

export namespace Assets.ui {
    export interface ITestListConfig extends IUICollectionConfig<IUIComponentStyles, Placeholder> {}

    export class List extends UICollection<IUIComponentStyles, Placeholder> {
        protected styleDefaults(styles: IUIComponentStyles): IUIComponentStyles {
            return styles;
        }
        protected createStyles(styles: IUIComponentStyles, selectorUid: string) {
            // no-op
        }
        public strAdd(items: string) {
            const me = this;
            items.split("").forEach((item: string) => {
                me.add(new Placeholder({ caption: item }));
            });
        }

        public strFilter(list?: string) {
            const me = this;
            if (!list) {
                me.clearFilter();
            } else {
                me.filter(item => {
                    return item.getCaption().inArray(list.split(""));
                });
            }
        }

        public getText() {
            const me = this,
                result: string[] = [];
            Blend.forEach(me.el.querySelectorAll(".b-uc-item"), (item: HTMLElement) => {
                result.push(item.innerText.trim());
            });
            return result.join("");
        }

        protected renderItem(item: Placeholder): HTMLElement {
            return item.getElement();
        }

        protected removeElement(item: Placeholder): void {
            item.getElement().parentElement.removeChild(item.getElement());
        }

        protected getWrapperOf(item: Placeholder): HTMLElement {
            return item.getElement();
        }

        protected finalizeRender() {
            super.finalizeRender();
            const sheet = stylesheet([
                CSS.block(".b-t-list", [
                    {
                        height: Blend.toPx(64),
                        backgroundColor: "#FAFAFA",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    },
                    CSS.child(".b-uc-item", {
                        width: Blend.toPx(48),
                        height: Blend.toPx(48),
                        border: "1px solid black",
                        marginLeft: Blend.toPx(5),
                        marginRight: Blend.toPx(5)
                    })
                ])
            ]);

            Browser.attachStyleSheet(sheet);
        }

        protected render(): HTMLElement {
            return this.createElement({
                css: ["b-t-list"],
                reference: "containerElement"
            });
        }
        protected doLayout(isInitial?: boolean): void {
            this.doLayoutItems();
        }
    }
}
