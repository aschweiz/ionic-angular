(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core', '../backdrop/backdrop', '../../config/config', '../../util/util', '../../util/keyboard', './menu-gestures', './menu-controller', '../../platform/platform', '../../gestures/gesture-controller', '../../util/ui-event-manager', '../content/content'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    var backdrop_1 = require('../backdrop/backdrop');
    var config_1 = require('../../config/config');
    var util_1 = require('../../util/util');
    var keyboard_1 = require('../../util/keyboard');
    var menu_gestures_1 = require('./menu-gestures');
    var menu_controller_1 = require('./menu-controller');
    var platform_1 = require('../../platform/platform');
    var gesture_controller_1 = require('../../gestures/gesture-controller');
    var ui_event_manager_1 = require('../../util/ui-event-manager');
    var content_1 = require('../content/content');
    var Menu = (function () {
        function Menu(_menuCtrl, _elementRef, _config, _platform, _renderer, _keyboard, _zone, _gestureCtrl) {
            this._menuCtrl = _menuCtrl;
            this._elementRef = _elementRef;
            this._config = _config;
            this._platform = _platform;
            this._renderer = _renderer;
            this._keyboard = _keyboard;
            this._zone = _zone;
            this._gestureCtrl = _gestureCtrl;
            this._isEnabled = true;
            this._isSwipeEnabled = true;
            this._isAnimating = false;
            this._isPers = false;
            this._init = false;
            this._events = new ui_event_manager_1.UIEventManager();
            this._gestureID = 0;
            this.isOpen = false;
            this.ionDrag = new core_1.EventEmitter();
            this.ionOpen = new core_1.EventEmitter();
            this.ionClose = new core_1.EventEmitter();
            if (_gestureCtrl) {
                this._gestureID = _gestureCtrl.newID();
            }
        }
        Object.defineProperty(Menu.prototype, "enabled", {
            get: function () {
                return this._isEnabled;
            },
            set: function (val) {
                this._isEnabled = util_1.isTrueProperty(val);
                this._setListeners();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Menu.prototype, "swipeEnabled", {
            get: function () {
                return this._isSwipeEnabled;
            },
            set: function (val) {
                this._isSwipeEnabled = util_1.isTrueProperty(val);
                this._setListeners();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Menu.prototype, "persistent", {
            get: function () {
                return this._isPers;
            },
            set: function (val) {
                this._isPers = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Menu.prototype.ngOnInit = function () {
            var _this = this;
            this._init = true;
            var content = this.content;
            this._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();
            if (!this._cntEle) {
                return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
            }
            if (this.side !== 'left' && this.side !== 'right') {
                this.side = 'left';
            }
            this.setElementAttribute('side', this.side);
            if (!this.type) {
                this.type = this._config.get('menuType');
            }
            this.setElementAttribute('type', this.type);
            this._cntGesture = new menu_gestures_1.MenuContentGesture(this, document.body, this._gestureCtrl);
            var hasEnabledSameSideMenu = this._menuCtrl.getMenus().some(function (m) {
                return m.side === _this.side && m.enabled;
            });
            if (hasEnabledSameSideMenu) {
                this._isEnabled = false;
            }
            this._setListeners();
            this._cntEle.classList.add('menu-content');
            this._cntEle.classList.add('menu-content-' + this.type);
            this._menuCtrl.register(this);
        };
        Menu.prototype.onBackdropClick = function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this._menuCtrl.close();
            return false;
        };
        Menu.prototype._setListeners = function () {
            if (!this._init) {
                return;
            }
            if (this._isEnabled && this._isSwipeEnabled && !this._cntGesture.isListening) {
                (void 0);
                this._cntGesture.listen();
            }
            else if (this._cntGesture.isListening && (!this._isEnabled || !this._isSwipeEnabled)) {
                (void 0);
                this._cntGesture.unlisten();
            }
        };
        Menu.prototype._getType = function () {
            if (!this._type) {
                this._type = menu_controller_1.MenuController.create(this.type, this, this._platform);
                if (this._config.get('animate') === false) {
                    this._type.ani.duration(0);
                }
            }
            return this._type;
        };
        Menu.prototype.setOpen = function (shouldOpen, animated) {
            var _this = this;
            if (animated === void 0) { animated = true; }
            if ((shouldOpen && this.isOpen) || !this._isEnabled || this._isAnimating) {
                return Promise.resolve(this.isOpen);
            }
            this._before();
            return new Promise(function (resolve) {
                _this._getType().setOpen(shouldOpen, animated, function () {
                    _this._after(shouldOpen);
                    resolve(_this.isOpen);
                });
            });
        };
        Menu.prototype.canSwipe = function () {
            return this._isEnabled && this._isSwipeEnabled && !this._isAnimating;
        };
        Menu.prototype.swipeStart = function () {
            if (this.canSwipe()) {
                this._before();
                this._getType().setProgressStart(this.isOpen);
            }
        };
        Menu.prototype.swipeProgress = function (stepValue) {
            if (!this._isAnimating) {
                return;
            }
            this._getType().setProgessStep(stepValue);
            var ionDrag = this.ionDrag;
            if (ionDrag.observers.length > 0) {
                this._zone.run(ionDrag.emit.bind(ionDrag, stepValue));
            }
        };
        Menu.prototype.swipeEnd = function (shouldCompleteLeft, shouldCompleteRight, stepValue) {
            var _this = this;
            if (!this._isAnimating) {
                return;
            }
            var opening = !this.isOpen;
            var shouldComplete = false;
            if (opening) {
                shouldComplete = (this.side === 'right') ? shouldCompleteLeft : shouldCompleteRight;
            }
            else {
                shouldComplete = (this.side === 'right') ? shouldCompleteRight : shouldCompleteLeft;
            }
            this._getType().setProgressEnd(shouldComplete, stepValue, function (isOpen) {
                (void 0);
                _this._after(isOpen);
            });
        };
        Menu.prototype._before = function () {
            (void 0);
            this.menuContent && this.menuContent.resize();
            this.setElementClass('show-menu', true);
            this.backdrop.setElementClass('show-backdrop', true);
            this._keyboard.close();
            this._isAnimating = true;
        };
        Menu.prototype._after = function (isOpen) {
            (void 0);
            this.isOpen = isOpen;
            this._isAnimating = false;
            this._events.unlistenAll();
            if (isOpen) {
                this._gestureCtrl.disableGesture('goback-swipe', this._gestureID);
                this._cntEle.classList.add('menu-content-open');
                var callback = this.onBackdropClick.bind(this);
                this._events.pointerEvents({
                    element: this._cntEle,
                    pointerDown: callback
                });
                this._events.pointerEvents({
                    element: this.backdrop.getNativeElement(),
                    pointerDown: callback
                });
                this.ionOpen.emit(true);
            }
            else {
                this._gestureCtrl.enableGesture('goback-swipe', this._gestureID);
                this._cntEle.classList.remove('menu-content-open');
                this.setElementClass('show-menu', false);
                this.backdrop.setElementClass('show-menu', false);
                this.ionClose.emit(true);
            }
        };
        Menu.prototype.open = function () {
            return this.setOpen(true);
        };
        Menu.prototype.close = function () {
            return this.setOpen(false);
        };
        Menu.prototype.toggle = function () {
            return this.setOpen(!this.isOpen);
        };
        Menu.prototype.enable = function (shouldEnable) {
            var _this = this;
            this.enabled = shouldEnable;
            if (!shouldEnable && this.isOpen) {
                this.close();
            }
            if (shouldEnable) {
                this._menuCtrl.getMenus()
                    .filter(function (m) { return m.side === _this.side && m !== _this; })
                    .map(function (m) { return m.enabled = false; });
            }
            return this;
        };
        Menu.prototype.swipeEnable = function (shouldEnable) {
            this.swipeEnabled = shouldEnable;
            return this;
        };
        Menu.prototype.getNativeElement = function () {
            return this._elementRef.nativeElement;
        };
        Menu.prototype.getMenuElement = function () {
            return this.getNativeElement().querySelector('.menu-inner');
        };
        Menu.prototype.getContentElement = function () {
            return this._cntEle;
        };
        Menu.prototype.getBackdropElement = function () {
            return this.backdrop.getNativeElement();
        };
        Menu.prototype.width = function () {
            return this.getMenuElement().offsetWidth;
        };
        Menu.prototype.getMenuController = function () {
            return this._menuCtrl;
        };
        Menu.prototype.setElementClass = function (className, add) {
            this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
        };
        Menu.prototype.setElementAttribute = function (attributeName, value) {
            this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, value);
        };
        Menu.prototype.ngOnDestroy = function () {
            this._menuCtrl.unregister(this);
            this._events.unlistenAll();
            this._cntGesture && this._cntGesture.destroy();
            this._type && this._type.destroy();
            this._cntGesture = null;
            this._type = null;
            this._cntEle = null;
        };
        Menu.decorators = [
            { type: core_1.Component, args: [{
                        selector: 'ion-menu',
                        template: '<div class="menu-inner"><ng-content></ng-content></div>' +
                            '<ion-backdrop disableScroll="false"></ion-backdrop>',
                        host: {
                            'role': 'navigation'
                        },
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                        encapsulation: core_1.ViewEncapsulation.None,
                    },] },
        ];
        Menu.ctorParameters = [
            { type: menu_controller_1.MenuController, },
            { type: core_1.ElementRef, },
            { type: config_1.Config, },
            { type: platform_1.Platform, },
            { type: core_1.Renderer, },
            { type: keyboard_1.Keyboard, },
            { type: core_1.NgZone, },
            { type: gesture_controller_1.GestureController, },
        ];
        Menu.propDecorators = {
            'backdrop': [{ type: core_1.ViewChild, args: [backdrop_1.Backdrop,] },],
            'menuContent': [{ type: core_1.ContentChild, args: [content_1.Content,] },],
            'content': [{ type: core_1.Input },],
            'id': [{ type: core_1.Input },],
            'side': [{ type: core_1.Input },],
            'type': [{ type: core_1.Input },],
            'enabled': [{ type: core_1.Input },],
            'swipeEnabled': [{ type: core_1.Input },],
            'persistent': [{ type: core_1.Input },],
            'maxEdgeStart': [{ type: core_1.Input },],
            'ionDrag': [{ type: core_1.Output },],
            'ionOpen': [{ type: core_1.Output },],
            'ionClose': [{ type: core_1.Output },],
        };
        return Menu;
    }());
    exports.Menu = Menu;
});
//# sourceMappingURL=menu.js.map