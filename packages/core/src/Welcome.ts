// tslint:disable:no-console
import { Blend } from "./Blend";

(() => {
    if (typeof console === "object" && console.log) {
        if (console.clear) {
            console.clear();
        }
        console.log(
            "\n" +
                " ____  _                _ ____  ____  _  __\n" +
                "| __ )| | ___ _ __   __| / ___||  _ \\| |/ /\n" +
                "|  _ \\| |/ _ \\ '_ \\ / _` \\___ \\| | | | ' / \n" +
                "| |_) | |  __/ | | | (_| |___) | |_| | . \\ \n" +
                "|____/|_|\\___|_| |_|\\__,_|____/|____/|_|\\_\\\n" +
                "\n" +
                "Hi there, fellow developer!\n\n" +
                "I hope this library can help you create great many applications.\n\n" +
                "Thanks for visiting and please let me know if you happen to find\n" +
                "any bugs. http://blendjs.com\n" +
                "\nBlend SDK Version: " +
                Blend.VERSION
        );
    }
})();

export {};
