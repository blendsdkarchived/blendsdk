export interface IDeviceInfoTest {
	name: string;
	expected: IDeviceInfoActual;
	userAgent: string | string[];
}

export interface IDeviceInfoActual {
	AndroidOS?: boolean;
	AndroidStock?: boolean;
	Chrome?: boolean;
	Cordova?: boolean;
	Edge?: boolean;
	Electron?: boolean;
	Firefox?: boolean;
	IE?: boolean;
	IEMobile?: boolean;
	iOS?: boolean;
	iPad?: boolean;
	iPhone?: boolean;
	iPod?: boolean;
	Linux?: boolean;
	Opera?: boolean;
	OSX?: boolean;
	Safari?: boolean;
	UCBrowser?: boolean;
	Unsupported?: boolean;
	Windows?: boolean;
	Yandex?: boolean;
	Desktop?: boolean;
	Device?: boolean;
}

export let deviceInfoTests: IDeviceInfoTest[] = [
	{
		name: "Safari on Windows",
		userAgent:
			"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
		expected: {
			Windows: true,
			Safari: true
		}
	},
	{
		name: "Yandex on Windows",
		userAgent:
			"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 YaBrowser/14.12.2125.9579 Safari/537.36",
		expected: {
			Windows: true,
			Yandex: true
		}
	},
	{
		name: "Opera on Windows",
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36 OPR/46.0.2597.26",
		expected: {
			Windows: true,
			Opera: true
		}
	},
	{
		name: "Chrome on Windows",
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
		expected: {
			Windows: true,
			Chrome: true
		}
	},
	{
		name: "Firefox on Windows",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
		expected: {
			Windows: true,
			Firefox: true
		}
	},
	{
		name: "Electron",
		userAgent: "Electron",
		expected: {
			Electron: true,
			Chrome: true
		}
	},
	{
		name: "Cordova",
		userAgent: "",
		expected: {
			Cordova: true,
			Chrome: true
		}
	},
	{
		name: "Mobile IE",
		userAgent: [
			"Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263",
			"Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; HTC; Windows Phone 8X by HTC) like Gecko"
		],
		expected: {
			IEMobile: true,
			Windows: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Edge Browser",
		userAgent: [
			"Mozilla/5.0 (Windows NT 6.3; Win64, x64; Touch) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0 (Touch; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; HPNTDFJS; H9P; InfoPath",
			"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10122"
		],
		expected: {
			Windows: true,
			Edge: true
		}
	},
	{
		name: "Unsupported (IE<11)",
		userAgent: [
			"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)",
			"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)",
			"Mozilla/5.0 (0; U; Compatible; MSIE 10.0; Windows Phone OS 8.1; Trident/7.0; rv:11.0; IEMobile/11.0; ARM; Touch; MyPhone; A1-A© Macintosh; U; Intel Mac OS X10_9_1; U; X11; U; Linux x86_64; en=ID) MyWebkit/537.36+; U; (KHTML, like Gecko; U;) Chrome/33.0.17",
			"Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 820)"
		],
		expected: {
			Windows: true,
			Unsupported: true
		}
	},
	{
		name: "IE 11 on Windows",
		userAgent: [
			"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko",
			"Mozilla/5.0 (Windows NT 6.3; Win64; x64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; rv:11.0) like Gecko"
		],
		expected: {
			Windows: true,
			IE: true
		}
	},
	{
		name: "Opera on Linux (Ubuntu)",
		userAgent:
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36 OPR/47.0.2631.55",
		expected: {
			Linux: true,
			Opera: true
		}
	},
	{
		name: "Yandex on Linux (Ubuntu",
		userAgent:
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.1.835 (beta) Yowser/2.5 Safari/537.36",
		expected: {
			Linux: true,
			Yandex: true
		}
	},
	{
		name: "Firefox on Linux (Ubuntu)",
		userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0",
		expected: {
			Linux: true,
			Firefox: true
		}
	},
	{
		name: "Chrome on Linux (Ubuntu)",
		userAgent:
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
		expected: {
			Linux: true,
			Chrome: true
		}
	},
	{
		name: "Firefox on Android",
		userAgent: [
			"Mozilla/5.0 (Android 7.0; Mobile; rv:51.0) Gecko/51.0 Firefox/51.0",
			"Mozilla/5.0 (Android 4.4.2; Tablet; rv:51.0) Gecko/51.0 Firefox/51.0"
		],
		expected: {
			Firefox: true,
			AndroidOS: true,
			Desktop: false,
			Device: true
		}
	},
	{
		name: "Opera on Android",
		userAgent:
			"Mozilla/5.0 (Linux; Android 4.2.2; KFTHWI Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.117 Safari/537.36 OPR/24.0.1565.82529",
		expected: {
			AndroidOS: true,
			Opera: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Chrome on Android",
		userAgent: [
			"Mozilla/5.0 (Linux; Android 4.4.2; SM-T530 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.83 Safari/537.36",
			"Mozilla/5.0 (Linux; Android 4.4.2; GT-I9505 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.83 Mobile Safari/537.36",
			"Mozilla/5.0 (Linux; Android 7.0; SAMSUNG SM-G950F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/5.2 Chrome/51.0.2704.106 Mobile Safari/537.36"
		],
		expected: {
			AndroidOS: true,
			Chrome: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "AndroidStock on Android",
		userAgent: [
			"Mozilla/5.0 (Linux; U; en-us; KFTHWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.15 Safari/535.19 Silk-Accelerated=true",
			"Mozilla/5.0 (Linux; U; Android 4.1.2; en-gb; GT-I9300 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
			"Mozilla/5.0 (Linux; U; Android 2.3.4; nl-nl; GT-I9100 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
		],
		expected: {
			AndroidOS: true,
			AndroidStock: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Chrome on iPad",
		userAgent:
			"Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/47.0.2526.107 Mobile/11B554a Safari/9537.53 (000113)",
		expected: {
			iOS: true,
			iPad: true,
			Chrome: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Safari on iOS iPad",
		userAgent:
			"Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53",
		expected: {
			iOS: true,
			iPad: true,
			Safari: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "UC Browser on iOS iPhone",
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X; en-US) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/13A405 UCBrowser/10.4.0.693 Mobile",
		expected: {
			iOS: true,
			iPhone: true,
			UCBrowser: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Firefox on iOS iPhone",
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) FxiOS/7.2b2672 Mobile/13A405 Safari/601.1.46",
		expected: {
			iOS: true,
			iPhone: true,
			Firefox: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Chrome on iOS iPhone",
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/58.0.3029.113 Mobile",
		expected: {
			iOS: true,
			iPhone: true,
			Chrome: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Safari on iOS iPhone",
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A405 Safari/601.1",
		expected: {
			iPhone: true,
			iOS: true,
			Safari: true,
			Device: true,
			Desktop: false
		}
	},
	{
		name: "Yandex on OSX",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 YaBrowser/17.7.1.720 Yowser/2.5 Safari/537.36",
		expected: {
			OSX: true,
			Yandex: true
		}
	},
	{
		name: "Opera on OSX",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.881",
		expected: {
			OSX: true,
			Opera: true
		}
	},
	{
		name: "Safari on OSX",
		userAgent: [
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/601.7.8"
		],
		expected: {
			OSX: true,
			Safari: true
		}
	},
	{
		name: "Chrome on OSX",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
		expected: {
			OSX: true,
			Chrome: true
		}
	},
	{
		name: "Firefox on OSX",
		userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0",
		expected: {
			OSX: true,
			Firefox: true
		}
	}
];
