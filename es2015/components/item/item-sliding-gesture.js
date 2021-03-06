import { PanGesture } from '../../gestures/drag-gesture';
import { pointerCoord } from '../../util/dom';
import { NativeRafDebouncer } from '../../util/debouncer';
const DRAG_THRESHOLD = 10;
const MAX_ATTACK_ANGLE = 20;
export class ItemSlidingGesture extends PanGesture {
    constructor(list) {
        super(list.getNativeElement(), {
            maxAngle: MAX_ATTACK_ANGLE,
            threshold: DRAG_THRESHOLD,
            zone: false,
            debouncer: new NativeRafDebouncer(),
            gesture: list._gestureCtrl.create('item-sliding', {
                priority: -10,
            })
        });
        this.list = list;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
    canStart(ev) {
        if (this.selectedContainer) {
            return false;
        }
        let container = getContainer(ev);
        if (!container) {
            this.closeOpened();
            return false;
        }
        if (container !== this.openContainer) {
            this.closeOpened();
        }
        let coord = pointerCoord(ev);
        this.preSelectedContainer = container;
        this.firstCoordX = coord.x;
        this.firstTimestamp = Date.now();
        return true;
    }
    onDragStart(ev) {
        ev.preventDefault();
        let coord = pointerCoord(ev);
        this.selectedContainer = this.openContainer = this.preSelectedContainer;
        this.selectedContainer.startSliding(coord.x);
    }
    onDragMove(ev) {
        ev.preventDefault();
        let coordX = pointerCoord(ev).x;
        this.selectedContainer.moveSliding(coordX);
    }
    onDragEnd(ev) {
        ev.preventDefault();
        let coordX = pointerCoord(ev).x;
        let deltaX = (coordX - this.firstCoordX);
        let deltaT = (Date.now() - this.firstTimestamp);
        this.selectedContainer.endSliding(deltaX / deltaT);
        this.selectedContainer = null;
        this.preSelectedContainer = null;
    }
    notCaptured(ev) {
        if (!clickedOptionButton(ev)) {
            this.closeOpened();
        }
    }
    closeOpened() {
        this.selectedContainer = null;
        if (this.openContainer) {
            this.openContainer.close();
            this.openContainer = null;
            return true;
        }
        return false;
    }
    destroy() {
        super.destroy();
        this.closeOpened();
        this.list = null;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
}
function getContainer(ev) {
    let ele = ev.target.closest('ion-item-sliding');
    if (ele) {
        return ele['$ionComponent'];
    }
    return null;
}
function clickedOptionButton(ev) {
    let ele = ev.target.closest('ion-item-options>button');
    return !!ele;
}
//# sourceMappingURL=item-sliding-gesture.js.map