import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { Assets } from "./Assets";

export default function(t: IDescribeProvider) {
    t.describe("Core Collection Tests", (t: ITestDescription) => {
        t.it("Swap", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            col.addSimple("ABCD");
            col.swap(col.getAt(1), col.getLast());
            t.assertEqual(col.getIds(), "ADCB");

            t.assertThrows(() => {
                col.swap(null, col.getLast());
            });

            t.done();
        });

        t.it("Sort", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            col.addSimple("KNFQALVEJSXWGRDBYHUTCPOIMZ");
            col.sort((a, b) => {
                const x = a.getId().charCodeAt(0),
                    y = b.getId().charCodeAt(0);
                return x > y ? 1 : x < y ? -1 : 0;
            });

            t.assertEqual(col.getIds(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

            t.done();
        });

        t.it("Remove", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            col.addSimple("ABCD");
            col.remove(col.getAt(1));
            t.assertEqual(col.getIds(), "ACD");

            t.done();
        });

        t.it("Remove Positional", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            col.addSimple("ABC");
            col.removeAt(0);
            t.assertEqual(col.getIds(), "BC", "at 0");

            col.clear();
            col.addSimple("ABC");
            col.removeAt(-1);
            t.assertEqual(col.getIds(), "AB", "at -1");

            col.clear();
            col.addSimple("ABCDE");
            col.removeAt(-10); // underflow
            t.assertEqual(col.getIds(), "BCDE", "at -10");

            col.clear();
            col.addSimple("ABCDE");
            col.removeAt(10); // overflow
            t.assertEqual(col.getIds(), "ABCDE", "at 10");

            col.clear();
            col.addSimple("ABCDE");
            col.removeAt(1);
            t.assertEqual(col.getIds(), "ACDE", "at 1");

            col.clear();
            col.addSimple("ABC");
            col.removeFirst();
            t.assertEqual(col.getIds(), "BC", "at first ");

            col.clear();
            col.addSimple("ABC");
            col.removeLast();
            t.assertEqual(col.getIds(), "AB", "at last");

            t.done();
        });

        t.it("Move", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            col.addSimple("ABCD");
            col.moveTo(-1, col.getFirst());
            t.assertEqual(col.getIds(), "BCAD");

            col.clear();
            col.addSimple("ABCD");
            col.moveTo(100, col.getFirst());
            t.assertEqual(col.getIds(), "BCDA");

            col.clear();
            col.addSimple("ABCD");
            col.moveFirst(col.getLast());
            t.assertEqual(col.getIds(), "DABC");

            col.clear();
            col.addSimple("ABCD");
            col.moveLast(col.getAt(2));
            t.assertEqual(col.getIds(), "ABDC");

            t.done();
        });

        t.it("Insert", (t: IAssertionProvider) => {
            // insert 0 at empty
            const col = new Assets.collection.SimpleCollection();
            col.insertAt(0, col.newItem("A"));
            t.assertEqual(col.getIds(), "A");
            t.assertEqual(col.count(), 1);

            // clear test
            col.clear();
            t.assertEqual(col.count(), 0);

            // insert at underflow
            col.insertAt(-1, col.newItem("B"));
            t.assertEqual(col.getIds(), "B");
            t.assertEqual(col.count(), 1);

            // insert overflow
            col.clear();
            col.insertAt(100, col.newItem("C"));
            t.assertEqual(col.getIds(), "C");
            t.assertEqual(col.count(), 1);

            // insert underflow
            col.clear();
            col.addSimple("ABCD");
            col.insertAt(-2, col.newItem("X"));
            t.assertEqual(col.getIds(), "ABXCD");

            // insert happy flow
            col.clear();
            col.addSimple("ABCD");
            col.insertAt(3, col.newItem("X"));
            t.assertEqual(col.getIds(), "ABCXD");

            t.assertThrows(() => {
                col.insertAt(0, null);
            });

            t.assertThrows(() => {
                col.insertAt(-1, undefined);
            });

            t.done();
        });

        t.it("Get", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();
            col.addSimple("ABCDE");

            t.assertEqual(col.getAt(0).getId(), "A", "at 0");
            t.assertEqual(col.getAt(1).getId(), "B", "at 1");
            t.assertEqual(col.getAt(2).getId(), "C", "at 2");
            t.assertEqual(col.getFirst().getId(), "A", "at first");
            t.assertEqual(col.getLast().getId(), "E", "at last");

            t.assertNotExists(col.getAt(10), "at 10");

            t.assertEqual(col.getAt(-1).getId(), "E", "at -1");
            t.assertEqual(col.getAt(-10).getId(), "A", "at -10");

            t.done();
        });

        t.it("Clear", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            col.addSimple("ABCD");
            col.clear();

            t.assertEqual(col.getIds(), "");
            t.assertEqual(col.count(), 0);

            t.done();
        });

        t.it("Add", (t: IAssertionProvider) => {
            const col = new Assets.collection.SimpleCollection();

            t.assertEqual(col.getIds(), "");

            col.addSimple("A");
            t.assertEqual(col.getIds(), "A");

            col.addSimple("BC");
            t.assertEqual(col.getIds(), "ABC");

            t.assertThrows(() => {
                col.add(null);
            });

            t.assertThrows(() => {
                col.add(undefined);
            });

            t.done();
        });
    });
}
