(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core', '../util/util'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    var util_1 = require('../util/util');
    var Config = (function () {
        function Config() {
            this._c = {};
            this._s = {};
            this._modes = {};
            this._trns = {};
        }
        Config.prototype.init = function (config, queryParams, platform) {
            this._s = config && util_1.isObject(config) && !util_1.isArray(config) ? config : {};
            this._qp = queryParams;
            this.platform = platform;
        };
        Config.prototype.get = function (key, fallbackValue) {
            if (fallbackValue === void 0) { fallbackValue = null; }
            if (!util_1.isDefined(this._c[key])) {
                if (!util_1.isDefined(key)) {
                    throw 'config key is not defined';
                }
                var userPlatformValue = undefined;
                var userDefaultValue = this._s[key];
                var userPlatformModeValue = undefined;
                var userDefaultModeValue = undefined;
                var platformValue = undefined;
                var platformModeValue = undefined;
                var configObj = null;
                if (this.platform) {
                    var queryStringValue = this._qp.get('ionic' + key);
                    if (util_1.isDefined(queryStringValue)) {
                        return this._c[key] = (queryStringValue === 'true' ? true : queryStringValue === 'false' ? false : queryStringValue);
                    }
                    var activePlatformKeys = this.platform.platforms();
                    for (var i = 0, ilen = activePlatformKeys.length; i < ilen; i++) {
                        if (this._s.platforms) {
                            configObj = this._s.platforms[activePlatformKeys[i]];
                            if (configObj) {
                                if (util_1.isDefined(configObj[key])) {
                                    userPlatformValue = configObj[key];
                                }
                                configObj = this.getModeConfig(configObj.mode);
                                if (configObj && util_1.isDefined(configObj[key])) {
                                    userPlatformModeValue = configObj[key];
                                }
                            }
                        }
                        configObj = this.platform.getPlatformConfig(activePlatformKeys[i]);
                        if (configObj && configObj.settings) {
                            if (util_1.isDefined(configObj.settings[key])) {
                                platformValue = configObj.settings[key];
                            }
                            configObj = this.getModeConfig(configObj.settings.mode);
                            if (configObj && util_1.isDefined(configObj[key])) {
                                platformModeValue = configObj[key];
                            }
                        }
                    }
                }
                configObj = this.getModeConfig(this._s.mode);
                if (configObj && util_1.isDefined(configObj[key])) {
                    userDefaultModeValue = configObj[key];
                }
                this._c[key] = util_1.isDefined(userPlatformValue) ? userPlatformValue :
                    util_1.isDefined(userDefaultValue) ? userDefaultValue :
                        util_1.isDefined(userPlatformModeValue) ? userPlatformModeValue :
                            util_1.isDefined(userDefaultModeValue) ? userDefaultModeValue :
                                util_1.isDefined(platformValue) ? platformValue :
                                    util_1.isDefined(platformModeValue) ? platformModeValue :
                                        null;
            }
            var rtnVal = this._c[key];
            if (util_1.isFunction(rtnVal)) {
                rtnVal = rtnVal(this.platform);
            }
            return (rtnVal !== null ? rtnVal : fallbackValue);
        };
        Config.prototype.getBoolean = function (key, fallbackValue) {
            if (fallbackValue === void 0) { fallbackValue = false; }
            var val = this.get(key);
            if (val === null) {
                return fallbackValue;
            }
            if (typeof val === 'string') {
                return val === 'true';
            }
            return !!val;
        };
        Config.prototype.getNumber = function (key, fallbackValue) {
            if (fallbackValue === void 0) { fallbackValue = NaN; }
            var val = parseFloat(this.get(key));
            return isNaN(val) ? fallbackValue : val;
        };
        Config.prototype.set = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var arg0 = args[0];
            var arg1 = args[1];
            switch (args.length) {
                case 2:
                    this._s[arg0] = arg1;
                    delete this._c[arg0];
                    break;
                case 3:
                    this._s.platforms = this._s.platforms || {};
                    this._s.platforms[arg0] = this._s.platforms[arg0] || {};
                    this._s.platforms[arg0][arg1] = args[2];
                    delete this._c[arg1];
                    break;
            }
            return this;
        };
        Config.prototype.settings = function (arg0, arg1) {
            switch (arguments.length) {
                case 0:
                    return this._s;
                case 1:
                    this._s = arg0;
                    this._c = {};
                    break;
                case 2:
                    this._s.platforms = this._s.platforms || {};
                    this._s.platforms[arg0] = arg1;
                    this._c = {};
                    break;
            }
            return this;
        };
        Config.prototype.setModeConfig = function (modeName, modeConfig) {
            this._modes[modeName] = modeConfig;
        };
        Config.prototype.getModeConfig = function (modeName) {
            return this._modes[modeName] || null;
        };
        Config.prototype.setTransition = function (trnsName, trnsClass) {
            this._trns[trnsName] = trnsClass;
        };
        Config.prototype.getTransition = function (trnsName) {
            return this._trns[trnsName] || null;
        };
        return Config;
    }());
    exports.Config = Config;
    exports.ConfigToken = new core_1.OpaqueToken('USERCONFIG');
    function setupConfig(userConfig, queryParams, platform) {
        var config = new Config();
        config.init(userConfig, queryParams, platform);
        return config;
    }
    exports.setupConfig = setupConfig;
});
//# sourceMappingURL=config.js.map