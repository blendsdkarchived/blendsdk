import html2canvas from "html2canvas";
import { Dom } from "./Dom";

/**
 * html2canvas render options
 */
export const renderOptions = {
	backgroundColor: null,
	scale: 1,
	allowTaint: true,
	useCORS: true
};

/**
 * Interface for describing image information
 *
 * @export
 * @interface ImageInfo
 */
export interface ImageInfo {
	imageData: ImageData;
	size: ClientRect;
}

/**
 * Interface for describing the diff result
 *
 * @export
 * @interface IDiffImageResult
 */
export interface IDiffImageResult {
	diffPct: number;
	imageDataA: ImageInfo;
	imageDataB: ImageInfo;
	diffImageData: ImageInfo;
}

/**
 * Loads an image into an canvas.
 *
 * @param {string} url
 * @param {(image: HTMLCanvasElement) => any} done
 */
function loadImage(url: string, done: (image: HTMLCanvasElement) => any) {
	const img = Dom.createElement<HTMLImageElement>({
		tag: "img",
		attrs: {
			src: url,
			crossOrigin: "Anonymous"
		},
		style: {
			position: "fixed",
			top: toPx(-10000),
			left: toPx(-10000)
		},
		listeners: {
			error: () => {
				done(null);
			},
			load: () => {
				const canvas = Dom.createElement<HTMLCanvasElement>({
					tag: "canvas",
					attrs: {
						width: img.width,
						height: img.height
					},
					style: {
						width: toPx(img.width),
						height: toPx(img.height),
						position: "fixed",
						top: toPx(-10000),
						left: toPx(-10000)
					}
				});
				document.body.appendChild(canvas);
				window.requestAnimationFrame(() => {
					const ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);
					window.requestAnimationFrame(() => {
						document.body.removeChild(img);
						done(canvas);
					});
				});
			}
		}
	});
	document.body.appendChild(img);
}

/**
 * Translates number to CSS px
 *
 * @param {number} value
 * @returns
 */
export function toPx(value: number) {
	return `${value}px`;
}

/**
 * Gets the image information for further processing
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {ImageInfo}
 */
function getImageInfo(canvas: HTMLCanvasElement): ImageInfo {
	const rect = canvas.getBoundingClientRect(),
		ctx = canvas.getContext("2d");
	return {
		imageData: ctx.getImageData(0, 0, rect.width, rect.height),
		size: rect
	};
}

/**
 * Creates a canvas element based on the provided image data
 *
 * @export
 * @param {ImageData} imageData
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function imageDataToCanvas(imageData: ImageData, width: number, height: number): HTMLCanvasElement {
	const el = Dom.createElement<HTMLCanvasElement>({
		tag: "canvas",
		attrs: {
			width,
			height
		},
		style: {
			width: toPx(width),
			height: toPx(height)
		}
	}),
		ctx = el.getContext("2d");
	ctx.putImageData(imageData, 0, 0);
	return el;
}

/**
 * Creates an empty canvas to be used for drawing the diff pixels
 *
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
function createDiffCanvas(width: number, height: number): HTMLCanvasElement {
	const el = Dom.createElement<HTMLCanvasElement>({
		tag: "canvas",
		attrs: {
			width,
			height
		},
		style: {
			width: toPx(width),
			height: toPx(height),
			border: `1px solid`,
			position: "fixed",
			top: toPx(-10000),
			left: toPx(-10000)
		}
	});
	document.body.appendChild(el);
	return el;
}

/**
 * Diffs image data from two canvas element.
 * and returns the difference in percentage.
 *
 * The diff image data result is written back to the out parameter
 *
 * @param {ImageData} imgA
 * @param {ImageData} imgB
 * @param {ImageData} out
 * @returns {number}
 */
function diffImageData(imgA: ImageData, imgB: ImageData, out: ImageData): number {
	let numDiff: number = 0;
	for (let r = 0; r !== imgA.data.length; r += 4) {
		const g = r + 1;
		const b = r + 2;
		const alpha = r + 3;

		out.data[r] = 255;
		out.data[g] = imgA.data[g] === imgB.data[g] ? 255 : 0;
		out.data[b] = imgA.data[b] === imgB.data[b] ? 255 : 0;
		out.data[alpha] = 255;

		numDiff += out.data[g] === 0 ? 1 : 0;
		numDiff += out.data[b] === 0 ? 1 : 0;
	}
	return (100 * numDiff) / imgA.data.length;
}

/**
 * Finds differences between the graphical representation of an
 * HTMLElement against an static image.
 *
 * @export
 * @param {HTMLElement} element
 * @param {string} imageUrl
 * @param {(result: IDiffImageResult, error: string) => any} done
 */
export function DiffImage(
	element: HTMLElement,
	imageUrl: string,
	done: (result: IDiffImageResult, error: string) => any
) {
	const snapshot: any = (window as any).html2canvas !== undefined ? (window as any).html2canvas : null;
	if (snapshot) {
		loadImage(imageUrl, (canvas1: HTMLCanvasElement) => {
			if (canvas1) {
				snapshot(element, renderOptions)
					.then((canvas2: HTMLCanvasElement) => {
						window.requestAnimationFrame(() => {
							// put the snapshot on the screen
							canvas2.style.position = "fixed";
							canvas2.style.top = toPx(-10000);
							canvas2.style.left = toPx(-10000);
							document.body.appendChild(canvas2);

							window.requestAnimationFrame(() => {
								let error = null;

								const rect1 = canvas1.getBoundingClientRect();
								const rect2 = canvas2.getBoundingClientRect();

								const dat1 = getImageInfo(canvas1);
								const dat2 = getImageInfo(canvas2);
								const diffCanvas = createDiffCanvas(rect1.width, rect1.height);
								const dat3 = getImageInfo(diffCanvas);

								const result: IDiffImageResult = {
									diffImageData: dat3,
									imageDataA: dat1,
									imageDataB: dat2,
									diffPct: -1
								};

								if (rect1.width !== rect2.width) {
									error = `Widths do not match: ${dat1.size.width} and ${dat2.size.width}`;
								}

								if (rect1.height !== rect2.height) {
									error = `Heights do not match: ${dat1.size.height} and ${dat2.size.height}`;
								}

								window.requestAnimationFrame(() => {
									if (!error) {
										result.diffPct = diffImageData(dat1.imageData, dat2.imageData, dat3.imageData);
										const ctxDiff = diffCanvas.getContext("2d");
										ctxDiff.putImageData(dat3.imageData, 0, 0);
									}

									diffCanvas.parentElement.removeChild(diffCanvas);
									canvas1.parentElement.removeChild(canvas1);
									canvas2.parentElement.removeChild(canvas2);

									done(result, error);
								});
							});
						});
					})
					.catch((error: any) => {
						done(null, error);
					});
			} else {
				done(null, `Unable to load ${imageUrl}`);
			}
		});
	} else {
		done(null, "No html2canvas library found!");
	}
}
