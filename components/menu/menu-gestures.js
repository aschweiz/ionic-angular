var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
import { assign } from '../../util/util';
import { NativeRafDebouncer } from '../../util/debouncer';
export var MenuContentGesture = (function (_super) {
    __extends(MenuContentGesture, _super);
    function MenuContentGesture(menu, contentEle, gestureCtrl, options) {
        if (options === void 0) { options = {}; }
        _super.call(this, contentEle, assign({
            direction: 'x',
            edge: menu.side,
            threshold: 0,
            maxEdgeStart: menu.maxEdgeStart || 50,
            maxAngle: 40,
            zone: false,
            debouncer: new NativeRafDebouncer(),
            gesture: gestureCtrl.create('menu-swipe', {
                priority: 10,
            })
        }, options));
        this.menu = menu;
    }
    MenuContentGesture.prototype.canStart = function (ev) {
        var menu = this.menu;
        if (!menu.canSwipe()) {
            return false;
        }
        if (menu.isOpen) {
            return true;
        }
        else if (menu.getMenuController().getOpen()) {
            return false;
        }
        return _super.prototype.canStart.call(this, ev);
    };
    MenuContentGesture.prototype.onSlideBeforeStart = function (ev) {
        (void 0);
        this.menu.swipeStart();
    };
    MenuContentGesture.prototype.onSlide = function (slide, ev) {
        var z = (this.menu.side === 'right' ? slide.min : slide.max);
        var stepValue = (slide.distance / z);
        (void 0);
        this.menu.swipeProgress(stepValue);
    };
    MenuContentGesture.prototype.onSlideEnd = function (slide, ev) {
        var z = (this.menu.side === 'right' ? slide.min : slide.max);
        var currentStepValue = (slide.distance / z);
        var velocity = slide.velocity;
        z = Math.abs(z * 0.5);
        var shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || slide.delta > z);
        var shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || slide.delta < -z);
        (void 0);
        this.menu.swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue);
    };
    MenuContentGesture.prototype.getElementStartPos = function (slide, ev) {
        if (this.menu.side === 'right') {
            return this.menu.isOpen ? slide.min : slide.max;
        }
        return this.menu.isOpen ? slide.max : slide.min;
    };
    MenuContentGesture.prototype.getSlideBoundaries = function () {
        if (this.menu.side === 'right') {
            return {
                min: -this.menu.width(),
                max: 0
            };
        }
        return {
            min: 0,
            max: this.menu.width()
        };
    };
    return MenuContentGesture;
}(SlideEdgeGesture));
//# sourceMappingURL=menu-gestures.js.map