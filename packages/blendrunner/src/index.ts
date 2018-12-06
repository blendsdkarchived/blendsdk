import { BlendRunnerUI } from './BlendRunnerUI';
import { BlendRunner } from './BlendRunner';
import { IDescribeProvider } from './Types';
import { Sheet } from './CSS';

var win: any = window;

const t: IDescribeProvider = win.runner || <IDescribeProvider>new BlendRunner();
const TestRunner: BlendRunnerUI = new BlendRunnerUI(<any>t);
const ABOUT_BLANK = 'about:blank';

export * from './Types';
export * from './CSSStyles';
export { t, TestRunner, ABOUT_BLANK, Sheet };
