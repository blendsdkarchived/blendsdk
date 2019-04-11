import { Blend, Component, IComponentConfig } from "@blendsdk/core";
import { TComponentReference } from "./Types";

/**
 * Interface for configuring a reference container component.
 *
 * @interface IReferenceContainerConfig
 * @extends {ICoreComponentConfig}
 */
// tslint:disable-next-line:no-empty-interface
export interface IReferenceContainerConfig extends IComponentConfig { }

/**
 * Abstract class that can be used to create an reference container
 * for other components. This class is typically used to create reference point for
 * UI components
 *
 * @export
 * @abstract
 * @class ReferenceContainer
 * @extends {Blend.core.Component}
 */
export abstract class ReferenceContainer extends Component {
    /**
     * Creates an instance of ReferenceContainer.
     * @param {IReferenceContainerConfig} [config]
     * @memberof ReferenceContainer
     */
	public constructor(config?: IReferenceContainerConfig) {
		super(config);
	}

    /**
     * Creates a reference outlet for this controller
     *
     * @public
     * @param {string} propertyName
     * @returns {TComponentReference}
     * @memberof Controller
     */
	public createReference(propertyName?: any): TComponentReference {
		const me = this;
		return (obj: Component) => {
			propertyName = propertyName || obj.getId() || null;
			if (!Blend.isNullOrUndef(propertyName)) {
				me.setReference(propertyName, obj);
			} else {
				throw new Error(
					"The provided propertyName is null or undefined. Make sure the referenced component " +
					// tslint:disable-next-line:max-line-length
					"has an `Id` configuration or call the `createReference()` method with a proper `propertyName` parameter!"
				);
			}
		};
	}

    /**
     * Creates a new property in this Controller that references the
     * given component.
     *
     * @protected
     * @param {string} propertyName
     * @param {Blend.core.Component} obj
     * @memberof Controller
     */
	protected setReference(propertyName: string, obj: Component) {
		const me: any = this,
			name = propertyName.replace(/_\$/gi, "");
		if (!me[name] || propertyName.indexOf("_$") === 0) {
			me[name] = obj;
		} else {
			throw new Error('This controller already has a reference "' + name + '"');
		}
	}
}
