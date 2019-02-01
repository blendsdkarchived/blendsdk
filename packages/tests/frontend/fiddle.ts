import { Application } from "@blendsdk/application";
import { IPlaceholderConfig, Placeholder, TUIComponent } from "@blendsdk/ui";
import { IActivatableUIComponent, ViewRouter } from "@blendsdk/viewrouter";

const app = new Application({
    mainView: new ViewRouter({
        routes: [
            {
                name: "login",
                path: "/users/:id/login",
                view: new Placeholder({
                    caption: `<a href="#/users/forgot-password">To Forgot</a>`,
                    onViewActivated: (sender: TUIComponent) => {
                        console.log(sender.getUserData("routeParams"));
                    }
                } as IActivatableUIComponent & IPlaceholderConfig),
                defaults: {
                    id: "999"
                }
            },
            {
                isDefault: true,
                name: "forgot",
                path: "/users/forgot-password",
                view: new Placeholder({
                    caption: `<a href="#/users/${new Date().getTime()}/login">To Login</a>`
                })
            }
        ]
    })
});
