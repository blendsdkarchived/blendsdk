import { t, TestRunner } from "@blendsdk/blendrunner";
import AjaxTests from "./ajax/AjaxTests";
import BrowserTests from "./browser/BrowserTests";
import ComponentTests from "./component/ComponentTests";
import BlendTests from "./core/BlendTests";
import BEMTests from "./css/BEMTests";
import CSSTests from "./css/CSSTests";
import DeviceInfoTests from "./deviceinfo/DeviceInfoTests";
import DomTests from "./dom/DomTests";
import ExtensionsTests from "./extensions/ExtensionsTets";
import IconTests from "./icon/IconTests";
import MVCTests from "./mvc/MVCTests";
import UITests from "./ui/UITests";

// import CollectionTests from './collection/CollectionTests';
// import FilteredCollectionTests from './collection/FilteredCollectionTests';

// import StackTests from './stack/StackTests';
// import AjaxTests from './ajax/AjaxTests';
// import MVCTests from './mvc/MVCTests';
// import UICollectionTests from './uicollection/UICollectionTests';
// import TaskTests from './task/TaskTests';
// TaskTests(t);
// UICollectionTests(t);
// MVCTests(t);
// StackTests(t);

UITests(t);
IconTests(t);
AjaxTests(t);
BrowserTests(t);
MVCTests(t);
BEMTests(t);
CSSTests(t);
DomTests(t);
// FilteredCollectionTests(t);
// CollectionTests(t);
ComponentTests(t);
DeviceInfoTests(t);
ExtensionsTests(t);
BlendTests(t);

TestRunner.start({
    hidePassed: true
});
