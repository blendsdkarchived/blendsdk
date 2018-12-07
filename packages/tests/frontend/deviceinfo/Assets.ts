import { DeviceInfoSingleton } from '@blendsdk/deviceinfo';

export namespace Assets {
    export class DeviceInfo extends DeviceInfoSingleton {
        public constructor(userAgent) {
            super(<Navigator>{
                userAgent: userAgent
            });
        }
    }
}
