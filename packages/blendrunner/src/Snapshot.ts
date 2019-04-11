import html2canvas from "html2canvas";
import { Dom } from "./Dom";
import { renderOptions, toPx } from "./ImageDiff";

/**
 * Utility to take a snapshot from an HTMLElement
 *
 * @class Snapshot
 */
class Snapshot {
	protected snapshot: any;

	constructor() {
		const me = this;
		if (!me.checkHTML2CanvasLIb()) {
			me.loadHTML2CanvasLIb((status: boolean) => {
				if (status) {
					me.snapshot = (window as any).html2canvas;
				}
			});
		} else {
			me.snapshot = (window as any).html2canvas;
		}
	}

	public take(element: HTMLElement, filename?: string) {
		const me = this;
		filename = filename || "snapshot.png";
		if (me.snapshot) {
			me.snapshot(element, renderOptions)
				.then((canvas: HTMLCanvasElement) => {
					window.requestAnimationFrame(() => {
						canvas.style.position = "fixed";
						canvas.style.top = toPx(-10000);
						canvas.style.left = toPx(-10000);
						document.body.appendChild(canvas);

						const png = canvas.toDataURL("image/png");

						const link = Dom.createElement({
							tag: "a",
							attrs: {
								download: filename,
								href: png.replace(/^data:image\/[^;]/, "data:application/octet-stream")
							},
							listeners: {
								click: () => {
									window.requestAnimationFrame(() => {
										link.parentElement.removeChild(link);
										canvas.parentElement.removeChild(canvas);
									});
								}
							}
						});
						document.body.appendChild(link);
						window.requestAnimationFrame(() => {
							link.click();
						});
					});
				})
				.catch((error: any) => {
					throw new Error(error);
				});
		} else {
			throw new Error("html2canvas is not ready!");
		}
	}

	protected checkHTML2CanvasLIb(): boolean {
		return (window as any).html2canvas !== undefined;
	}

	protected loadHTML2CanvasLIb(done: (status: boolean) => any) {
		document.head.appendChild(
			Dom.createElement({
				tag: "script",
				attrs: {
					src: "https://unpkg.com/html2canvas@latest/dist/html2canvas.min.js"
				}
			})
		);
		let timeout = 0;
		const checker = setInterval(() => {
			if ((window as any).html2canvas) {
				clearInterval(checker);
				done(true);
			} else if (timeout > 50) {
				clearInterval(checker);
				done(false);
			} else {
				timeout += 1;
			}
		}, 100);
	}
}

export const snapshot: Snapshot = new Snapshot();
