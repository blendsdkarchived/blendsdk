import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";

export default function(t: IDescribeProvider) {
    t.describe("UI Collection Tests", (t: ITestDescription) => {
        t.inBrowser("Should move (underflow & filtered)", "/browser/uicollection_move_underflow_filtered.html");
        t.inBrowser("Should move (overflow & filtered)", "/browser/uicollection_move_overflow_filtered.html");
        t.inBrowser("Should move (within & filtered)", "/browser/uicollection_move_within_filtered.html");
        t.inBrowser("Should insertAt (overflow)", "/browser/uicollection_insert_overflow.html");
        t.inBrowser("Should move (underflow & within)", "/browser/uicollection_move_underflow_within.html");
        t.inBrowser("Should move (overflow)", "/browser/uicollection_move_overflow.html");
        t.inBrowser("Should move last", "/browser/uicollection_move_last.html");
        t.inBrowser("Should swap (filtered)", "/browser/uicollection_move_swap_filtered.html");
        t.inBrowser("Should swap", "/browser/uicollection_swap.html");
        t.inBrowser("Should removeAt (filtered)", "/browser/uicollection_remove_filtered.html");
        t.inBrowser("Should remove item", "/browser/uicollection_remove.html");
        t.inBrowser("Should insertAt (within & filtered)", "/browser/uicollection_insert_within_filtered.html");
        t.inBrowser("Should add item", "/browser/uicollection_add.html");
        t.inBrowser("Should add & insert", "/browser/uicollection_add_insert.html");
    });
}
