// tslint:disable:max-classes-per-file
import { Component, IComponentConfig } from "@blendsdk/core";
import { UIComponent } from "@blendsdk/ui";

export interface IStackTransitionConfig extends IComponentConfig {
    containerElement: HTMLElement;
}

export interface IStackTransitionOptions {
    /**
     * Option to configure whether the View transition should
     * apply the animation provided by the TransitionProvider's
     * sub-class.
     *
     * By default this parameter is true
     *
     * @type {boolean}
     * @memberof IStackTransitionOptions
     */
    animate?: boolean;
}

/**
 * Base class hot handling transitions from one view to another
 * within a Stack view
 *
 * @export
 * @abstract
 * @class Transition
 * @extends {Blend.core.Component}
 */
export abstract class TransitionProvider extends Component {
    protected archive: DocumentFragment;
    protected currentView: UIComponent;
    protected config: IStackTransitionConfig & IComponentConfig;

    public constructor(config?: IStackTransitionConfig) {
        super(config);
        this.archive = document.createDocumentFragment();
    }

    public archiveView(view: UIComponent) {
        const me = this,
            el = view.getElement();
        me.archive.appendChild(el);
    }

    public unArchiveView(view: UIComponent) {
        const me = this,
            el = view.getElement();
        me.config.containerElement.appendChild(el);
    }

    public abstract pushView(
        view: UIComponent,
        options: IStackTransitionOptions,
        doneCallback?: (view: UIComponent, state: boolean) => void
    ): void;
}

/**
 * Provides default transition for the Stack View
 *
 * @export
 * @class DefaultTransitionProvider
 * @extends {Blend.view.stack.TransitionProvider}
 */

export class DefaultTransitionProvider extends TransitionProvider {
    /**
     * @override
     * @param {dom.Component} view
     * @param {IStackTransitionOptions} options
     * @param {Function} [doneCallback]
     * @memberof DefaultTransitionProvider
     */
    public pushView(
        view: UIComponent,
        options: IStackTransitionOptions,
        doneCallback?: (view: UIComponent, state: boolean) => void
    ) {
        const me = this,
            done = doneCallback || (() => {});
        me.unArchiveView(view);
        if (me.currentView) {
            me.archiveView(me.currentView);
            done(me.currentView, false);
        }
        done(view, true);
        me.currentView = view;
    }
}
