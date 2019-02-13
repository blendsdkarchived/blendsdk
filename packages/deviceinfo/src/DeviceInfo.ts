/**
 * Enum providing browser types.
 *
 * @export
 * @enum {number}
 */
export enum eBrowserType {
    Chrome = "chrome",
    FireFox = "firefox",
    Safari = "safari",
    MSIE = "msie",
    Edge = "edge",
    Unsupported = "unsupported"
}

/**
 * Interface providing information about the current device.
 * This interface is implemented and available from {`Blend.runtime.deviceInfo`}
 *
 * @interface IDeviceInformation
 */
export interface IDeviceInfo {
    iOS: boolean;
    AndroidOS: boolean;
    AndroidStock: boolean;
    IEMobile: boolean;
    Chrome: boolean;
    Safari: boolean;
    Firefox: boolean;
    Opera: boolean;
    Yandex: boolean;
    UCBrowser: boolean;
    Cordova: boolean;
    Electron: boolean;
    Windows: boolean;
    Linux: boolean;
    OSX: boolean;
    iPhone: boolean;
    iPad: boolean;
    iPod: boolean;
    Edge: boolean;
    IE: boolean;
    Unsupported: boolean;
    Device: boolean;
    Desktop: boolean;
}

/**
 * DeviceInformation provide information regarding the current
 * browser and OS. This class uses UserAgent parsing and recognition
 * in order to gather the required information.
 *
 * The available device and browser characteristics are provided using the
 * {IDeviceInformation} interface from JavaScript runtime and as CSS keys
 * set to the HTML element.
 *
 * PLEASE NOTE:
 * Using the UserAgent string to gather device information is not always
 * reliable because each OS and browser vendor provides a slight different
 * format and structures time to time!
 *
 * PLEASE NOTE:
 * When the `Unsupported` key corresponds to MSIE version below 11!
 *
 * PLEASE NOTE:
 * Only the modern Opera browsers which are based on Chrome are recognized!
 *
 * PLEASE NOTE:
 * We force the DeviceInformation return Chrome as browser when Cordova
 * and Electron are recognized
 *
 * @export
 * @class DeviceInformation
 */
export class DeviceInfoSingleton {
    /**
     * The current UserAgent string;
     *
     * @protected
     * @type {string}
     * @memberof DeviceInformation
     */
    protected userAgent: string;
    /**
     * The current browser type;
     *
     * @protected
     * @type {string}
     * @memberof DeviceInfoSingleton
     */
    protected browserType: eBrowserType;

    public constructor(nav?: Navigator) {
        const me = this;
        nav = nav || navigator;
        me.userAgent = "";
        if (nav) {
            if (nav.userAgent) {
                me.userAgent = nav.userAgent;
            }
        }
    }

    /**
     * Get the current device information by tokenizing and recognizing
     * parts of the UserAgent string.
     *
     * @returns {IDeviceInfo}
     * @memberof DeviceInformation
     */
    public getInformation(): IDeviceInfo {
        const me = this,
            // Look for 'Chrome'
            chrome = /\bChrome\b|\bCriOS\b/.test(me.userAgent),
            // Look for 'Macintosh'
            macintosh = /\bMacintosh\b/.test(me.userAgent),
            // Look for 'OS X'
            osx = /OS\ X/.test(me.userAgent),
            // Look for Firefox or FxiOS
            firefox = /\bFirefox\b|\bFxiOS\b/.test(me.userAgent),
            // Look for 'Safari'
            safari = /\bSafari\b/.test(me.userAgent),
            // Look for 'Opera'
            opera = /\bOPR\b/.test(me.userAgent),
            // Look for 'YaBrowser'
            yandex = /\bYaBrowser\b/.test(me.userAgent),
            // Look for 'iPhone'
            iphone = /\biPhone\b/.test(me.userAgent),
            // Look for 'iPad'
            ipad = /\biPad\b/.test(me.userAgent),
            // Look for 'iPod'
            ipod = /\biPod\b/.test(me.userAgent),
            // Look for 'UCBrowser' (from China)
            ucbrowser = /\bUCBrowser\b/.test(me.userAgent),
            // Look for 'Android'
            // tslint:disable-next-line:variable-name
            _androidos = /\bAndroid\b/.test(me.userAgent),
            // Look for 'Linux'
            linux = /\bLinux\b/.test(me.userAgent),
            // Look for 'Tablet'
            tablet = /\bTablet\b/.test(me.userAgent),
            // Look for 'Mobile'
            mobile = /\bMobile\b/.test(me.userAgent),
            // Look for 'Silk-Accelerated' (Amazon Kindle)
            slickacc = /\bSilk\-Accelerated\b/.test(me.userAgent),
            // Calculate Android OS
            androidos =
                (_androidos && linux) || (_androidos && tablet) || (_androidos && mobile) || (linux && slickacc),
            // Look for 'Windows NT'
            windows = /\bWindows\ NT\b/.test(me.userAgent),
            // Look for 'Trident'
            trident = /\bTrident\b/.test(me.userAgent),
            // Look for 'rev:11' or IE11
            rev11 = /\brv\:11\b/.test(me.userAgent),
            // Look for 'MSIE'
            msie = /\bMSIE\b/.test(me.userAgent),
            // Look for 'Edge'
            edge = /\bEdge\b/.test(me.userAgent),
            // Look for 'IEMobile'
            iemobile = /\bIEMobile\b/.test(me.userAgent),
            // Look for 'Windows Phone'
            winphone = /\bWindows\ Phone\b/.test(me.userAgent),
            // Canculate for MS Phone or Windows Phone
            msphone = iemobile || winphone,
            cordova = !!(window as any).cordova,
            electron = me.isElectron();
        /**
         * Combine the tokens and return the IDeviceInformation
         */
        const result: IDeviceInfo = {
            iOS: iphone || ipad || ipod,
            // tslint:disable-next-line:object-literal-sort-keys
            AndroidOS: androidos && !msphone,
            AndroidStock: (androidos && linux && safari && !chrome) || (linux && slickacc) /* Amazon Kindle */,
            IEMobile: msphone && !msie,
            Chrome: (chrome && !opera && !yandex && !edge && !msphone) || cordova || electron,
            Safari: safari && !chrome && !opera && !firefox && !_androidos && !linux,
            Firefox: firefox,
            Cordova: cordova,
            Opera: opera,
            Yandex: yandex,
            UCBrowser: ucbrowser,
            Electron: electron,
            Windows: windows || winphone,
            Linux: linux && !androidos && !msphone,
            OSX: macintosh && osx && !msphone,
            iPhone: iphone,
            iPad: ipad,
            iPod: ipod,
            Edge: edge && !msphone,
            IE: !msie && windows && trident && rev11,
            Unsupported: msie,
            Desktop: false,
            Device: false
        };
        result.Device = !msie && (result.iOS || result.AndroidOS || result.AndroidStock || winphone || msphone);
        result.Desktop = !result.Device;

        if (result.Chrome || result.Opera || result.Yandex || result.UCBrowser) {
            me.browserType = eBrowserType.Chrome;
        } else if (result.IE) {
            me.browserType = eBrowserType.MSIE;
        } else if (result.Safari) {
            me.browserType = eBrowserType.Safari;
        } else if (result.Edge) {
            me.browserType = eBrowserType.Edge;
        }

        return result;
    }

    /**
     * Gets the current browser type.
     *
     * @returns {string}
     * @memberof DeviceInfoSingleton
     */
    public getBrowserType(): string {
        return this.browserType;
    }

    /**
     * Detects is we are running inside an Electron shell
     *
     * @protected
     * @returns {boolean}
     * @memberof DeviceInformation
     * @license https://github.com/cheton/is-electron (MIT) Original source is modified!
     */
    protected isElectron(): boolean {
        const me = this;
        // Renderer process
        if (window && (window as any).process && (window as any).process.type === "renderer") {
            return true;
        }

        // Main process
        if (typeof process !== "undefined" && process.versions && !!(process as any).versions.electron) {
            return true;
        }

        // Detect the user agent when the `nodeIntegration` option is set to true
        if (me.userAgent.indexOf("Electron") >= 0) {
            return true;
        }

        return false;
    }
}

export const DeviceInfo: DeviceInfoSingleton = new DeviceInfoSingleton();
