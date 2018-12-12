// tslint:disable:max-line-length
import { ICreateElementConfig } from "./Types";

export function ZoomInIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-clipboard-icon", "x-small-icon", "x-value-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M11,4A7,7 0 0,1 18,11C18,12.5 17.5,14 16.61,15.19L17.42,16H18L23,21L21,23L16,18V17.41L15.19,16.6C12.1,18.92 7.71,18.29 5.39,15.2C3.07,12.11 3.7,7.72 6.79,5.4C8,4.5 9.5,4 11,4M10,7V10H7V12H10V15H12V12H15V10H12V7H10M1,1V8L8,1H1Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function SmallClipBoardIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-clipboard-icon", "x-small-icon", "x-value-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function SmallWatchIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-watch-icon", "x-small-icon", "x-value-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function SmallPassIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-pass-icon", "x-small-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function SmallFailIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-fail-icon", "x-small-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function ClockIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-clock-icon", "x-large-icon", "rotating"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function PassIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-pass-icon", "x-large-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
                }
            }
        ]
    } as ICreateElementConfig;
}

export function FailIcon(): ICreateElementConfig {
    return {
        isSVG: true,
        tag: "svg",
        css: ["x-fail-icon", "x-large-icon"],
        attrs: {
            viewBox: "0 0 24 24"
        },
        children: [
            {
                tag: "path",
                attrs: {
                    d:
                        "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                }
            }
        ]
    } as ICreateElementConfig;
}
