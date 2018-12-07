import { ITestDescription, IAssertionProvider, IDescribeProvider } from '@blendsdk/blendrunner';
import { Blend, Component } from '@blendsdk/core';
import { Assets } from './Assets';

export default function(t: IDescribeProvider) {
    t.describe('Blend Core', (t: ITestDescription) => {
        t.it('Blend.wrapInArray', (t: IAssertionProvider) => {
            var a: Array<number> = [1, 2, 3, 4],
                b: Array<number> = Blend.wrapInArray(a);
            t.assertTrue(Blend.isArray(Blend.wrapInArray(1)));
            t.assertTrue(Blend.isArray(Blend.wrapInArray('a')));
            t.assertTrue(Blend.isArray(Blend.wrapInArray({})));
            t.assertTrue(Blend.isArray(Blend.wrapInArray(null)));
            t.assertTrue(Blend.isArray(Blend.wrapInArray(undefined)));
            t.assertEqual(b.length, a.length);
            t.done();
        });

        t.it('Blend.isString', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isString('string value'));
            t.assertFalse(Blend.isString(null));
            t.assertFalse(Blend.isString(undefined));
            t.assertTrue(Blend.isString(''));
            t.assertFalse(Blend.isString(true));
            t.assertFalse(Blend.isString(1.2));
            t.assertFalse(Blend.isString({}));
            t.done();
        });

        t.it('Blend.isRegExp', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isRegExp(/^foo(bar)?$/i));
            t.assertFalse(Blend.isRegExp(null));
            t.assertFalse(Blend.isRegExp(undefined));
            t.assertFalse(Blend.isRegExp(''));
            t.assertFalse(Blend.isRegExp(true));
            t.assertFalse(Blend.isRegExp(2));
            t.assertFalse(Blend.isRegExp({}));
            t.done();
        });

        t.it('Blend.isObject', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isObject({}));
            t.assertFalse(Blend.isObject(/^foo(bar)?$/i));
            t.assertFalse(Blend.isObject(null));
            t.assertFalse(Blend.isObject(undefined));
            t.assertFalse(Blend.isObject(''));
            t.assertFalse(Blend.isObject(true));
            t.assertFalse(Blend.isObject(2));
            t.assertFalse(Blend.isObject([]));
            t.done();
        });

        t.it('Blend.isNumeric', (t: IAssertionProvider) => {
            t.assertFalse(Blend.isNumeric(null));
            t.assertFalse(Blend.isNumeric(undefined));
            t.assertFalse(Blend.isNumeric(false));
            t.assertFalse(Blend.isNumeric(true));
            t.assertFalse(Blend.isNumeric('0'));
            t.assertFalse(Blend.isNumeric('1'));
            t.assertFalse(Blend.isNumeric({}));
            t.assertFalse(Blend.isNumeric([]));
            t.assertTrue(Blend.isNumeric(1));
            t.assertTrue(Blend.isNumeric(1.95));
            t.done();
        });

        t.it('Blend.isNullOrUndef', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isNullOrUndef(null));
            t.assertTrue(Blend.isNullOrUndef(undefined));
            t.assertFalse(Blend.isNullOrUndef(1));
            t.assertFalse(Blend.isNullOrUndef(''));
            t.assertFalse(Blend.isNullOrUndef(true));
            t.assertFalse(Blend.isNullOrUndef({}));
            t.done();
        });

        t.it('Blend.isInstanceOf', (t: IAssertionProvider) => {
            var o = new Assets.Greeter();

            t.assertTrue(Blend.isInstanceOf(o, Component));

            t.assertTrue(Blend.isInstanceOf(document.body.children, HTMLCollection));

            t.done();
        });

        t.it('Blend.isFunction', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isFunction(() => {}));
            t.assertFalse(Blend.isFunction(1));
            t.assertFalse(Blend.isFunction(null));
            t.assertFalse(Blend.isFunction(undefined));
            t.assertFalse(Blend.isFunction(''));
            t.assertFalse(Blend.isFunction(true));
            t.assertFalse(Blend.isFunction({}));
            t.done();
        });

        t.it('Blend.isClass', (t: IAssertionProvider) => {
            t.assertFalse(Blend.isClass(1));
            t.assertFalse(Blend.isClass(true));
            t.assertFalse(Blend.isClass(''));
            t.assertTrue(Blend.isClass(Date), 'Date');
            t.assertTrue(Blend.isClass(Assets.TestComponent));
            t.done();
        });

        t.it('Blend.isBoolean', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isBoolean(true));
            t.assertTrue(Blend.isBoolean(false));
            t.assertFalse(Blend.isBoolean({}));
            t.assertFalse(Blend.isBoolean(/^foo(bar)?$/i));
            t.assertFalse(Blend.isBoolean(null));
            t.assertFalse(Blend.isBoolean(undefined));
            t.assertFalse(Blend.isBoolean(''));
            t.assertFalse(Blend.isBoolean(0));
            t.assertFalse(Blend.isBoolean(2));
            t.assertFalse(Blend.isBoolean([]));
            t.done();
        });

        t.it('Blend.isArray', (t: IAssertionProvider) => {
            t.assertTrue(Blend.isArray([]));
            t.assertFalse(Blend.isArray(''));
            t.assertFalse(Blend.isArray(1));
            t.assertFalse(Blend.isArray(null));
            t.assertFalse(Blend.isArray(undefined));
            t.assertFalse(Blend.isArray(document.children), 'test the document.children');
            t.assertFalse(Blend.isArray({ length: 0 }));
            t.done();
        });

        t.it('Blend.getClassName', (t: IAssertionProvider) => {
            var c = new Assets.TestComponent();
            var o = {};

            t.assertEqual(Blend.getClassName(c), 'TestComponent');
            t.assertEqual(Blend.getClassName(o), 'Object');

            t.done();
        });

        t.it('Blend.forEach querySelectorAll', (t: IAssertionProvider) => {
            var el = document.createElement('DIV');
            var ids = '';
            document.body.appendChild(el);
            el.innerHTML = "<span id='A'></span><span id='B'></span><span id='C'></span><span id='D'></span>";
            Blend.forEach(el.querySelectorAll('span'), function(child: HTMLElement, index: number) {
                ids += child.getAttribute('id');
            });
            t.assertEqual(ids, 'ABCD');
            el.parentElement.removeChild(el);
            t.delay(200, t.done);
        });

        t.it('Blend.forEach Object', (t: IAssertionProvider) => {
            var dictionaty = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
            var sum = 0;
            var keys = '';
            Blend.forEach(dictionaty, function(value: number, key: string) {
                sum += value;
                keys += key;
            });
            t.assertEqual(sum, 55, 'sum in dictionary');
            t.assertEqual(keys, 'abcdefghij', 'keys in dictionary');
            t.done();
        });

        t.it('Blend.forEach HTMLCollection', (t: IAssertionProvider) => {
            var el = document.createElement('DIV');
            document.body.appendChild(el);
            var ids = '';
            el.innerHTML = "<span id='A'></span><span id='B'></span><span id='C'></span><span id='D'></span>";
            Blend.forEach(el.children, function(child: HTMLElement, index: number) {
                ids += child.getAttribute('id');
            });
            t.assertEqual(ids, 'ABCD');
            el.parentElement.removeChild(el);
            t.delay(200, t.done);
        });

        t.it('Blend.forEach Array', (t: IAssertionProvider) => {
            var numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var sum = 0;
            Blend.forEach(numArray, function(item: number, index: number) {
                sum += item;
            });
            t.assertEqual(sum, 55, 'foreach Array');
            t.done();
        });

        t.it('Blend.ensureBoolean', (t: IAssertionProvider) => {
            t.assertFalse(Blend.ensureBoolean(1));
            t.assertFalse(Blend.ensureBoolean(null));
            t.assertFalse(Blend.ensureBoolean(''));
            t.assertFalse(Blend.ensureBoolean(undefined));
            t.assertFalse(Blend.ensureBoolean({}));
            t.assertFalse(Blend.ensureBoolean(false));
            t.assertTrue(Blend.ensureBoolean(true));
            t.done();
        });

        t.it('Blend.delay', (t: IAssertionProvider) => {
            Blend.delay(200, function() {
                t.assertTrue(true);
                t.done();
            });
        });

        t.it('Blend.apply', (t: IAssertionProvider) => {
            t.assertNotExists(Blend.apply(null, null));
            t.assertNotExists(Blend.apply(null, undefined));
            t.assertNotExists(Blend.apply(undefined, null));

            t.assertEqual(Blend.apply(1, 0), 1);
            t.assertEqual(Blend.apply(1, [1, 2, 3, 4]), 1);
            t.assertEqual(Blend.apply([1, 2, 3, 4], 1), [1, 2, 3, 4, 1]);
            t.done();
        });

        t.it('Blend.debounce', (t: IAssertionProvider) => {
            var count = 0;
            var add = function() {
                count++;
            };
            var debouncedAdd: Function = Blend.debounce(100, add);

            for (var a = 0; a != 100; a++) {
                debouncedAdd();
            }

            t.delay(250, function() {
                t.assertEqual(count, 1);
                t.done();
            });
        });

        t.it('Blend.createComponent', (t: IAssertionProvider) => {
            t.assertThrows(function() {
                Blend.createComponent(null);
            });

            var cmp = Blend.createComponent<Assets.Person>(Assets.Person);
            t.assertEqual(cmp.getName(), 'No Name!');

            var cmp2 = Blend.createComponent<Assets.Person>(Assets.Person, <Assets.ITestPersonConfig>{
                name: 'Blend!'
            });
            t.assertEqual(cmp2.getName(), 'Blend!');

            var cmp3 = Blend.createComponent(<any>cmp);
            t.assertEqual(cmp3.getUID(), cmp.getUID());

            t.assertEqual(Blend.createComponent(<any>1), 1);

            t.done();
        });
    });
}
