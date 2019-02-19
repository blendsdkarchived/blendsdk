interface IA {
    a?: any;
}

interface IB {
    b?: any;
}

type TAB = IA & IB;

interface IC extends TAB {
    c?: any;
}

const obj: IC = {};

// import { Browser } from "@blendsdk/browser";
// import { Blend } from "@blendsdk/core";
// import { CSS, Reset, Sheet, StyleSheets } from "@blendsdk/css";
// import { ToolbarSpacer } from "@blendsdk/ui";

// Browser.ready(() => {
//     document.body.appendChild(
//         new ToolbarSpacer({
//             flexSize: 1
//         })
//     );
// });

// const sheet = new Sheet();

// sheet.addRule([
//     CSS.block("body", [
//         {
//             willChange: ["opacity", "transform"]
//         },
//         CSS.after({
//             content: ["''", "none"]
//         })
//     ])
// ]);

// StyleSheets.attach(sheet);

// import { Application } from "@blendsdk/application";
// import { IPlaceholderConfig, Placeholder, TUIComponent } from "@blendsdk/ui";
// import { IActivatableUIComponent, ViewRouter } from "@blendsdk/viewrouter";

// const app = new Application({
//     mainView: new ViewRouter({
//         routes: [
//             {
//                 name: "login",
//                 path: "/users/:id/login",
//                 view: new Placeholder({
//                     caption: `<a href="#/users/forgot-password">To Forgot</a>`,
//                     onViewActivated: (sender: TUIComponent) => {
//                         console.log(sender.getUserData("routeParams"));
//                     }
//                 } as IActivatableUIComponent & IPlaceholderConfig),
//                 defaults: {
//                     id: "999"
//                 }
//             },
//             {
//                 isDefault: true,
//                 name: "forgot",
//                 path: "/users/forgot-password",
//                 view: new Placeholder({
//                     caption: `<a href="#/users/${new Date().getTime()}/login">To Login!</a>`
//                 })
//             }
//         ]
//     })
// });
