import { OpaqueToken } from '@angular/core';
import { windowLoad } from '../util/dom';
export const PLATFORM_CONFIGS = {
    core: {
        settings: {
            mode: 'md',
            keyboardHeight: 290
        }
    },
    mobile: {},
    phablet: {
        isMatch(p) {
            let smallest = Math.min(p.width(), p.height());
            let largest = Math.max(p.width(), p.height());
            return (smallest > 390 && smallest < 520) &&
                (largest > 620 && largest < 800);
        }
    },
    tablet: {
        isMatch(p) {
            let smallest = Math.min(p.width(), p.height());
            let largest = Math.max(p.width(), p.height());
            return (smallest > 460 && smallest < 820) &&
                (largest > 780 && largest < 1400);
        }
    },
    android: {
        superset: 'mobile',
        subsets: [
            'phablet',
            'tablet'
        ],
        settings: {
            activator: function (p) {
                if (p.testNavigatorPlatform('linux')) {
                    let chromeVersion = p.matchUserAgentVersion(/Chrome\/(\d+).(\d+)?/);
                    if (chromeVersion) {
                        return (parseInt(chromeVersion.major, 10) < 36 ? 'none' : 'ripple');
                    }
                    if (p.version().major < 5) {
                        return 'none';
                    }
                }
                return 'ripple';
            },
            autoFocusAssist: 'immediate',
            hoverCSS: false,
            keyboardHeight: 300,
            mode: 'md',
        },
        isMatch(p) {
            return p.isPlatformMatch('android', ['android', 'silk'], ['windows phone']);
        },
        versionParser(p) {
            return p.matchUserAgentVersion(/Android (\d+).(\d+)?/);
        }
    },
    ios: {
        superset: 'mobile',
        subsets: [
            'ipad',
            'iphone'
        ],
        settings: {
            autoFocusAssist: 'delay',
            hoverCSS: false,
            inputBlurring: isIOSDevice,
            inputCloning: isIOSDevice,
            keyboardHeight: 300,
            mode: 'ios',
            scrollAssist: isIOSDevice,
            statusbarPadding: !!(window.cordova),
            swipeBackEnabled: isIOSDevice,
            swipeBackThreshold: 40,
            tapPolyfill: isIOSDevice,
            virtualScrollEventAssist: !(window.indexedDB),
        },
        isMatch(p) {
            return p.isPlatformMatch('ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
        },
        versionParser(p) {
            return p.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
        }
    },
    ipad: {
        superset: 'tablet',
        settings: {
            keyboardHeight: 500,
        },
        isMatch(p) {
            return p.isPlatformMatch('ipad');
        }
    },
    iphone: {
        subsets: [
            'phablet'
        ],
        isMatch(p) {
            return p.isPlatformMatch('iphone');
        }
    },
    windows: {
        superset: 'mobile',
        subsets: [
            'phablet',
            'tablet'
        ],
        settings: {
            mode: 'wp',
            autoFocusAssist: 'immediate',
            hoverCSS: false
        },
        isMatch(p) {
            return p.isPlatformMatch('windows', ['windows phone']);
        },
        versionParser(p) {
            return p.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
        }
    },
    cordova: {
        isEngine: true,
        initialize: function (p) {
            p.prepareReady = function () {
                windowLoad(function () {
                    document.addEventListener('deviceready', function () {
                        document.addEventListener('backbutton', function (ev) {
                            p.zone.run(() => {
                                p.backButton.emit(ev);
                            });
                        });
                        document.addEventListener('pause', function (ev) {
                            p.zone.run(() => {
                                p.pause.emit(ev);
                            });
                        });
                        document.addEventListener('resume', function (ev) {
                            p.zone.run(() => {
                                p.resume.emit(ev);
                            });
                        });
                        p.exitApp = function () {
                            window.navigator.app.exitApp();
                        };
                        p.triggerReady('cordova');
                    });
                });
            };
        },
        isMatch() {
            return !!(window.cordova || window.PhoneGap || window.phonegap);
        }
    }
};
function isIOSDevice(p) {
    return p.testNavigatorPlatform('iphone|ipad|ipod');
}
export const PlatformConfigToken = new OpaqueToken('PLTCONFIG');
export function providePlatformConfigs() {
    return PLATFORM_CONFIGS;
}
//# sourceMappingURL=platform-registry.js.map