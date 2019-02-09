import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";

export default function(t: IDescribeProvider) {
    t.describe("Task Tests", (t: ITestDescription) => {
        t.inBrowser("Should run all (happy flow)", "/browser/task_happyflow.html");
    });
}
