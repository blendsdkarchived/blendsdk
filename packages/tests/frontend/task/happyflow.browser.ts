import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { TaskRunner } from "@blendsdk/task";
import { Placeholder } from "@blendsdk/ui";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        const taskRunner = new TaskRunner();
        const ph = new Placeholder();

        document.body.appendChild(ph);

        taskRunner.addTask((taskDone: (stop?: boolean) => any) => {
            Blend.raf(() => {
                ph.setCaption("A");
                Blend.raf(() => {
                    taskDone();
                });
            });
        });

        taskRunner.addTask((taskDone: (stop?: boolean) => any) => {
            Blend.raf(() => {
                ph.setCaption(ph.getCaption() + "B");
                Blend.raf(() => {
                    taskDone();
                });
            });
        });

        taskRunner.addTask((taskDone: (stop?: boolean) => any) => {
            Blend.raf(() => {
                ph.setCaption(ph.getCaption() + "C");
                Blend.raf(() => {
                    taskDone();
                });
            });
        });

        taskRunner.addTask((taskDone: (stop?: boolean) => any) => {
            Blend.raf(() => {
                t.assertEqual(ph.getCaption(), "ABC");
                Blend.raf(() => {
                    taskDone();
                });
            });
        });

        taskRunner.run(() => {
            t.done();
        });
    });
}
