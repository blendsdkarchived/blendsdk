import { IAssertionProvider } from '@blendsdk/blendrunner';
import { Dom, CssClass } from '@blendsdk/dom';
import { Blend } from '@blendsdk/core';

export default function(t: IAssertionProvider) {
    var el = Dom.createElement({
        css: ['b-rule1', 'b-rule2']
    });

    var ruleSet = CssClass.create([], el);

    document.body.appendChild(el);

    Blend.raf(function() {
        ruleSet.serialize();
        t.assertEqual(el.getAttribute('class'), 'b-rule1 b-rule2');
        t.done();
    });
}
