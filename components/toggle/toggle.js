var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ElementRef, EventEmitter, forwardRef, Input, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { isTrueProperty } from '../../util/util';
import { Ion } from '../ion';
import { Item } from '../item/item';
import { pointerCoord } from '../../util/dom';
import { Haptic } from '../../util/haptic';
import { UIEventManager } from '../../util/ui-event-manager';
export var TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return Toggle; }),
    multi: true
};
export var Toggle = (function (_super) {
    __extends(Toggle, _super);
    function Toggle(_form, config, elementRef, renderer, _haptic, _item) {
        _super.call(this, config, elementRef, renderer);
        this._form = _form;
        this._haptic = _haptic;
        this._item = _item;
        this._checked = false;
        this._init = false;
        this._disabled = false;
        this._activated = false;
        this._msPrv = 0;
        this._fn = null;
        this._events = new UIEventManager();
        this.ionChange = new EventEmitter();
        this.mode = config.get('mode');
        _form.register(this);
        if (_item) {
            this.id = 'tgl-' + _item.registerInput('toggle');
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-toggle', true);
        }
    }
    Object.defineProperty(Toggle.prototype, "color", {
        set: function (val) {
            this._setColor('toggle', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Toggle.prototype, "mode", {
        set: function (val) {
            this._setMode('toggle', val);
        },
        enumerable: true,
        configurable: true
    });
    Toggle.prototype.pointerDown = function (ev) {
        this._startX = pointerCoord(ev).x;
        this._activated = true;
        return true;
    };
    Toggle.prototype.pointerMove = function (ev) {
        if (this._startX) {
            var currentX = pointerCoord(ev).x;
            (void 0);
            if (this._checked) {
                if (currentX + 15 < this._startX) {
                    this.onChange(false);
                    this._haptic.selection();
                    this._startX = currentX;
                    this._activated = true;
                }
            }
            else if (currentX - 15 > this._startX) {
                this.onChange(true);
                this._haptic.selection();
                this._startX = currentX;
                this._activated = (currentX < this._startX + 5);
            }
        }
    };
    Toggle.prototype.pointerUp = function (ev) {
        if (this._startX) {
            var endX = pointerCoord(ev).x;
            if (this.checked) {
                if (this._startX + 4 > endX) {
                    this.onChange(false);
                    this._haptic.selection();
                }
            }
            else if (this._startX - 4 < endX) {
                this.onChange(true);
                this._haptic.selection();
            }
            this._activated = false;
            this._startX = null;
        }
    };
    Object.defineProperty(Toggle.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (val) {
            this._setChecked(isTrueProperty(val));
            this.onChange(this._checked);
        },
        enumerable: true,
        configurable: true
    });
    Toggle.prototype._setChecked = function (isChecked) {
        if (!this._disabled && isChecked !== this._checked) {
            this._checked = isChecked;
            if (this._init) {
                this.ionChange.emit(this);
            }
            this._item && this._item.setElementClass('item-toggle-checked', isChecked);
        }
    };
    Toggle.prototype.writeValue = function (val) {
        this._setChecked(isTrueProperty(val));
    };
    Toggle.prototype.registerOnChange = function (fn) {
        this._fn = fn;
    };
    Toggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    Object.defineProperty(Toggle.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            this._disabled = isTrueProperty(val);
            this._item && this._item.setElementClass('item-toggle-disabled', this._disabled);
        },
        enumerable: true,
        configurable: true
    });
    Toggle.prototype.onChange = function (isChecked) {
        (void 0);
        this._fn && this._fn(isChecked);
        this._setChecked(isChecked);
        this.onTouched();
    };
    Toggle.prototype.onTouched = function () { };
    Toggle.prototype.ngAfterContentInit = function () {
        this._init = true;
        this._events.pointerEvents({
            elementRef: this._elementRef,
            pointerDown: this.pointerDown.bind(this),
            pointerMove: this.pointerMove.bind(this),
            pointerUp: this.pointerUp.bind(this)
        });
    };
    Toggle.prototype.ngOnDestroy = function () {
        this._form.deregister(this);
        this._events.unlistenAll();
        this._fn = null;
    };
    Toggle.decorators = [
        { type: Component, args: [{
                    selector: 'ion-toggle',
                    template: '<div class="toggle-icon" [class.toggle-checked]="_checked" [class.toggle-activated]="_activated">' +
                        '<div class="toggle-inner"></div>' +
                        '</div>' +
                        '<button role="checkbox" ' +
                        'type="button" ' +
                        'ion-button="item-cover" ' +
                        '[id]="id" ' +
                        '[attr.aria-checked]="_checked" ' +
                        '[attr.aria-labelledby]="_labelId" ' +
                        '[attr.aria-disabled]="_disabled" ' +
                        'class="item-cover">' +
                        '</button>',
                    host: {
                        '[class.toggle-disabled]': '_disabled'
                    },
                    providers: [TOGGLE_VALUE_ACCESSOR],
                    encapsulation: ViewEncapsulation.None,
                },] },
    ];
    Toggle.ctorParameters = [
        { type: Form, },
        { type: Config, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: Haptic, },
        { type: Item, decorators: [{ type: Optional },] },
    ];
    Toggle.propDecorators = {
        'color': [{ type: Input },],
        'mode': [{ type: Input },],
        'ionChange': [{ type: Output },],
        'checked': [{ type: Input },],
        'disabled': [{ type: Input },],
    };
    return Toggle;
}(Ion));
//# sourceMappingURL=toggle.js.map