import '@blendsdk/extensions';
import { ITestDescription, IAssertionProvider, IDescribeProvider } from '@blendsdk/blendrunner';

export default function(t: IDescribeProvider) {
    t.describe('Extensions Library', (t: ITestDescription) => {
        t.it('usFirst Should Work', (t: IAssertionProvider) => {
            if (t.assertExists(''.ucFirst)) {
                t.assertEqual('HELLO'.ucFirst(), 'Hello');
            }
            t.done();
        });
    });
}
