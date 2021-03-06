import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
import { assign } from '../../util/util';
import { NativeRafDebouncer } from '../../util/debouncer';
export class MenuContentGesture extends SlideEdgeGesture {
    constructor(menu, contentEle, gestureCtrl, options = {}) {
        super(contentEle, assign({
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
    canStart(ev) {
        let menu = this.menu;
        if (!menu.canSwipe()) {
            return false;
        }
        if (menu.isOpen) {
            return true;
        }
        else if (menu.getMenuController().getOpen()) {
            return false;
        }
        return super.canStart(ev);
    }
    onSlideBeforeStart(ev) {
        (void 0);
        this.menu.swipeStart();
    }
    onSlide(slide, ev) {
        let z = (this.menu.side === 'right' ? slide.min : slide.max);
        let stepValue = (slide.distance / z);
        (void 0);
        this.menu.swipeProgress(stepValue);
    }
    onSlideEnd(slide, ev) {
        let z = (this.menu.side === 'right' ? slide.min : slide.max);
        let currentStepValue = (slide.distance / z);
        let velocity = slide.velocity;
        z = Math.abs(z * 0.5);
        let shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || slide.delta > z);
        let shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || slide.delta < -z);
        (void 0);
        this.menu.swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue);
    }
    getElementStartPos(slide, ev) {
        if (this.menu.side === 'right') {
            return this.menu.isOpen ? slide.min : slide.max;
        }
        return this.menu.isOpen ? slide.max : slide.min;
    }
    getSlideBoundaries() {
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
    }
}
//# sourceMappingURL=menu-gestures.js.map