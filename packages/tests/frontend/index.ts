import { t, TestRunner } from "@blendsdk/blendrunner";
import AjaxTests from "./ajax/AjaxTests";
import BrowserTests from "./browser/BrowserTests";
import CollectionTests from "./collection/CollectionTests";
import FilteredCollectionTests from "./collection/FilteredCollectionTests";
import ComponentTests from "./component/ComponentTests";
import BlendTests from "./core/BlendTests";
import BEMTests from "./css/BEMTests";
import CSSTests from "./css/CSSTests";
import DeviceInfoTests from "./deviceinfo/DeviceInfoTests";
import DomTests from "./dom/DomTests";
import ExtensionsTests from "./extensions/ExtensionsTests";
import IconTests from "./icon/IconTests";
import MVCTests from "./mvc/MVCTests";
import TaskTests from "./task/TaskTests";
import UITests from "./ui/UITests";
import UICollectionTests from "./uicollection/UICollectionTests";

UICollectionTests(t);
CollectionTests(t);
FilteredCollectionTests(t);
TaskTests(t);
UITests(t);
IconTests(t);
AjaxTests(t);
BrowserTests(t);
MVCTests(t);
BEMTests(t);
CSSTests(t);
DomTests(t);
ComponentTests(t);
DeviceInfoTests(t);
ExtensionsTests(t);
BlendTests(t);

TestRunner.start({
    hidePassed: true
});
