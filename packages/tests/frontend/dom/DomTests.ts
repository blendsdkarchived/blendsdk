import { ITestDescription, IAssertionProvider, IDescribeProvider } from '@blendsdk/blendrunner';

export default function(t: IDescribeProvider) {
    t.describe('Dom Tests', (t: ITestDescription) => {
        t.inBrowser('Should create setters', '/browser/dom_setters.html');
        t.inBrowser('Should not touch the rules', '/browser/dom_notouch.html');
        t.inBrowser('Should add rules', '/browser/dom_add.html');
    });
}
