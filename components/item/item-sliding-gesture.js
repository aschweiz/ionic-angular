var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PanGesture } from '../../gestures/drag-gesture';
import { pointerCoord } from '../../util/dom';
import { NativeRafDebouncer } from '../../util/debouncer';
var DRAG_THRESHOLD = 10;
var MAX_ATTACK_ANGLE = 20;
export var ItemSlidingGesture = (function (_super) {
    __extends(ItemSlidingGesture, _super);
    function ItemSlidingGesture(list) {
        _super.call(this, list.getNativeElement(), {
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
    ItemSlidingGesture.prototype.canStart = function (ev) {
        if (this.selectedContainer) {
            return false;
        }
        var container = getContainer(ev);
        if (!container) {
            this.closeOpened();
            return false;
        }
        if (container !== this.openContainer) {
            this.closeOpened();
        }
        var coord = pointerCoord(ev);
        this.preSelectedContainer = container;
        this.firstCoordX = coord.x;
        this.firstTimestamp = Date.now();
        return true;
    };
    ItemSlidingGesture.prototype.onDragStart = function (ev) {
        ev.preventDefault();
        var coord = pointerCoord(ev);
        this.selectedContainer = this.openContainer = this.preSelectedContainer;
        this.selectedContainer.startSliding(coord.x);
    };
    ItemSlidingGesture.prototype.onDragMove = function (ev) {
        ev.preventDefault();
        var coordX = pointerCoord(ev).x;
        this.selectedContainer.moveSliding(coordX);
    };
    ItemSlidingGesture.prototype.onDragEnd = function (ev) {
        ev.preventDefault();
        var coordX = pointerCoord(ev).x;
        var deltaX = (coordX - this.firstCoordX);
        var deltaT = (Date.now() - this.firstTimestamp);
        this.selectedContainer.endSliding(deltaX / deltaT);
        this.selectedContainer = null;
        this.preSelectedContainer = null;
    };
    ItemSlidingGesture.prototype.notCaptured = function (ev) {
        if (!clickedOptionButton(ev)) {
            this.closeOpened();
        }
    };
    ItemSlidingGesture.prototype.closeOpened = function () {
        this.selectedContainer = null;
        if (this.openContainer) {
            this.openContainer.close();
            this.openContainer = null;
            return true;
        }
        return false;
    };
    ItemSlidingGesture.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.closeOpened();
        this.list = null;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    };
    return ItemSlidingGesture;
}(PanGesture));
function getContainer(ev) {
    var ele = ev.target.closest('ion-item-sliding');
    if (ele) {
        return ele['$ionComponent'];
    }
    return null;
}
function clickedOptionButton(ev) {
    var ele = ev.target.closest('ion-item-options>button');
    return !!ele;
}
//# sourceMappingURL=item-sliding-gesture.js.map