import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { Assets } from "./Assets";

export default function (t: IDescribeProvider) {
	t.describe("Filtered Collection Tests", (t: ITestDescription) => {
		t.it("Swap", (t: IAssertionProvider) => {
			const col = new Assets.collection.SimpleCollection();

			// happy flow
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("CEF".split("")); // filter
			});
			col.swap(col.getFirst(), col.getLast());
			t.assertEqual(col.getIds(), "FEC");
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABFDECG");

			t.assertThrows(() => {
				col.swap(col.getFirst(), null);
			});

			t.done();
		});

		t.it("Sort", (t: IAssertionProvider) => {
			const col = new Assets.collection.SimpleCollection();

			col.addSimple("KNFQALVEJSXWGRDBYHUTCPOIMZ");
			col.filter(a => {
				return a.getId().inArray("ZSR".split("")); // filter
			});

			col.sort((a, b) => {
				const x = a.getId().charCodeAt(0),
					y = b.getId().charCodeAt(0);
				return x > y ? 1 : x < y ? -1 : 0;
			});

			t.assertEqual(col.getIds(), "RSZ");
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

			t.done();
		});

		t.it("Remove", (t: IAssertionProvider) => {
			const col = new Assets.collection.SimpleCollection();

			// happy flow
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("BDF".split("")); // filter
			});

			col.remove(col.getAt(1)); // D
			col.remove(col.getAt(1)); // F
			t.assertEqual(col.getIds(), "B");

			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCEG");

			t.assertThrows(() => {
				col.remove(null);
			});

			t.assertThrows(() => {
				col.remove(undefined);
			});

			t.done();
		});

		t.it("Remove Positional", (t: IAssertionProvider) => {
			const col = new Assets.collection.SimpleCollection();
			// happy flow
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("BDF".split("")); // filter
			});
			col.removeAt(1);
			t.assertEqual(col.getIds(), "BF");
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCEFG");

			col.clear();

			// hallo flow first last
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("AG".split("")); // filter
			});
			col.removeAt(0); // A
			col.removeAt(0); // G
			t.assertEqual(col.getIds(), "");
			col.clearFilter();
			t.assertEqual(col.getIds(), "BCDEF");

			col.clear();

			// overflow (should not remove anything)
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("ACG".split("")); // filter
			});
			col.removeAt(100);
			t.assertEqual(col.getIds(), "ACG");
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCDEFG");

			col.clear();

			// underflow within limits
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("ACE".split("")); // filter
			});
			col.removeAt(-1);
			t.assertEqual(col.getIds(), "AC");

			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCDFG");

			col.clear();

			// underflow far off  limits should remove first
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("BDE".split("")); // filter
			});
			col.removeAt(-100);
			t.assertEqual(col.getIds(), "DE");

			col.clearFilter();
			t.assertEqual(col.getIds(), "ACDEFG");

			t.done();
		});

		t.it("Move", (t: IAssertionProvider) => {
			const col = new Assets.collection.SimpleCollection();

			// happy flow
			col.addSimple("ABCDE"); // init
			col.filter(a => {
				return a.getId().inArray("BDE".split("")); // filter
			});

			col.moveTo(0, col.getLast());
			t.assertEqual(col.getIds(), "EBD");

			col.clearFilter();
			t.assertEqual(col.getIds(), "AEBCD");

			col.clear();
			// move down 1
			col.addSimple("ABCDE"); // init
			col.filter(a => {
				return a.getId().inArray("BD".split("")); // filter
			});
			col.moveTo(1, col.getFirst());
			t.assertEqual(col.getIds(), "DB");

			col.clearFilter();
			t.assertEqual(col.getIds(), "ACDBE");

			col.clear();

			// underflow too far
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("CEG".split("")); // filter
			});

			col.moveTo(-10, col.getAt(1));
			t.assertEqual(col.getIds(), "ECG");
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABECDFG");

			col.clear();

			// underflow too far both
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("ABC".split("")); // filter
			});

			col.moveTo(-10, col.getLast());
			t.assertEqual(col.getIds(), "CAB");
			col.clearFilter();
			t.assertEqual(col.getIds(), "CABDEFG");

			t.done();
		});

		t.it("Insert", (t: IAssertionProvider) => {
			// add should add to the last item both
			// when filtered and unfiltered states

			const col = new Assets.collection.SimpleCollection();

			// happy flow
			col.addSimple("ABCDEFG"); // init
			col.filter(a => {
				return a.getId().inArray("BDF".split("")); // filter
			});
			col.insertAt(1, col.newItem("+"));
			t.assertEqual(col.getIds(), "B+DF");

			// negative flow
			col.insertAt(-1, col.newItem("-"));
			t.assertEqual(col.getIds(), "B+D-F");

			col.clearFilter();
			t.assertEqual(col.getIds(), "ABC+DE-FG");

			col.clear();

			// over flow
			col.addSimple("ABCDEFG");
			col.filter(a => {
				return a.getId().inArray("BDF".split(""));
			});
			col.insertAt(3, col.newItem("#"));
			t.assertEqual(col.getIds(), "BDF#"); // check filtered
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCDEF#G"); // check filtered

			col.clear();

			// overflow on the last item both
			col.addSimple("ABCDEFG");
			col.filter(a => {
				return a.getId().inArray("DFG".split(""));
			});

			col.insertAt(3, col.newItem("#"));
			t.assertEqual(col.getIds(), "DFG#"); // check filtered
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABCDEFG#"); // check filtered

			col.clear();

			// underflow to far from 0
			col.addSimple("ABCDEFG");
			col.filter(a => {
				return a.getId().inArray("DFG".split(""));
			});

			col.insertAt(-20, col.newItem("*"));
			t.assertEqual(col.getIds(), "*DFG"); // check filtered
			col.clearFilter();
			t.assertEqual(col.getIds(), "ABC*DEFG"); // check filtered

			col.clear();

			// underflow on first both

			col.addSimple("ABCDEFG");
			col.filter(a => {
				return a.getId().inArray("A".split(""));
			});
			col.insertAt(-20, col.newItem("*"));
			t.assertEqual(col.getIds(), "*A"); // check filtered
			col.clearFilter();
			t.assertEqual(col.getIds(), "*ABCDEFG");

			col.clear();
			for (let a = 0; a !== 100000; a++) {
				col.addSimple("A");
			}
			col.filter((item, index) => {
				return index % 2 === 0;
			});
			col.insertAt(-200, col.newItem("Z"));

			t.done();
		});

		t.it("Filter", (t: IAssertionProvider) => {
			const col = new Assets.collection.SimpleCollection();
			col.addSimple("ACDEAA");

			col.filter(a => {
				return a.getId() === "A";
			});

			t.assertEqual(col.getIds(), "AAA");

			col.clearFilter();
			t.assertEqual(col.getIds(), "ACDEAA");

			t.done();
		});

		t.it("Clear", (t: IAssertionProvider) => {
			let col = new Assets.collection.SimpleCollection();

			col.addSimple("ABCDEFG");
			col.filter(a => {
				return a.getId().inArray("BDF".split("")); // filter
			});

			col.clear();
			t.assertEqual(col.getIds(), "");
			t.assertEqual(col.count(), 0);

			col.clearFilter();
			t.assertEqual(col.getIds(), "ACEG");

			col = new Assets.collection.SimpleCollection();
			col.addSimple("ABCDEFG");
			col.filter(a => {
				return a.getId().inArray("BDF".split("")); // filter
			});

			col.clear(true);
			t.assertEqual(col.getIds(), "");
			t.assertEqual(col.count(), 0);

			col.clearFilter();
			t.assertEqual(col.getIds(), "");
			t.assertEqual(col.count(), 0);

			t.done();
		});

		t.it("Add", (t: IAssertionProvider) => {
			// add should add to the last item both
			// when filtered and unfiltered states

			const col = new Assets.collection.SimpleCollection();

			col.addSimple("ABCDEFG");

			col.filter(a => {
				return a.getId().inArray("BCF".split(""));
			});

			col.addSimple("X");

			t.assertEqual(col.getIds(), "BCFX");

			col.clearFilter();

			t.assertEqual(col.getIds(), "ABCDEFGX");

			t.done();
		});
	});
}
