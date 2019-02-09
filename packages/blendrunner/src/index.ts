import { BlendRunner } from "./BlendRunner";
import { BlendRunnerUI } from "./BlendRunnerUI";
import { Sheet } from "./CSS";
import { IDescribeProvider } from "./Types";

const win: any = window;

const t: IDescribeProvider = win.runner || (new BlendRunner() as IDescribeProvider);
const TestRunner: BlendRunnerUI = new BlendRunnerUI(t as any);
const ABOUT_BLANK = "about:blank";

export * from "./Types";
export * from "./CSSStyles";
export { t, TestRunner, ABOUT_BLANK, Sheet };
export * from "./Snapshot";
