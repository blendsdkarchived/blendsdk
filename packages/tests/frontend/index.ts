import BlendTests from './core/BlendTests';
import DeviceInfoTests from './deviceinfo/DeviceInfoTests';
import ComponentTests from './component/ComponentTests';
// import CollectionTests from './collection/CollectionTests';
// import FilteredCollectionTests from './collection/FilteredCollectionTests';
// import DomTests from './dom/Domtests';
// import IconTests from './icon/IconTests';
// import StackTests from './stack/StackTests';
// import AjaxTests from './ajax/AjaxTests';
// import MVCTests from './mvc/MVCTests';
// import UICollectionTests from './uicollection/UICollectionTests';
// import TaskTests from './task/TaskTests';

import ExtensionsTests from './extensions/ExtensionsTets';
import { t, TestRunner } from '@blendsdk/blendrunner';

// TaskTests(t);
// UICollectionTests(t);
// MVCTests(t);
// StackTests(t);
// AjaxTests(t);
// IconTests(t);
// DomTests(t);
// FilteredCollectionTests(t);
// CollectionTests(t);
ComponentTests(t);
DeviceInfoTests(t);
ExtensionsTests(t);
BlendTests(t);

TestRunner.start();
