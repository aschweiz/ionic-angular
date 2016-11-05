import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Config } from '../../config/config';
import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
export var PopoverCmp = (function () {
    function PopoverCmp(_cfr, _elementRef, _renderer, _config, _navParams, _viewCtrl) {
        this._cfr = _cfr;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._config = _config;
        this._navParams = _navParams;
        this._viewCtrl = _viewCtrl;
        this.d = _navParams.data.opts;
        _renderer.setElementClass(_elementRef.nativeElement, "popover-" + _config.get('mode'), true);
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(function (cssClass) {
                if (cssClass.trim() !== '')
                    _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++popoverIds);
    }
    PopoverCmp.prototype.ionViewPreLoad = function () {
        var activeElement = document.activeElement;
        if (document.activeElement) {
            activeElement.blur();
        }
        this._load(this._navParams.data.component);
    };
    PopoverCmp.prototype._load = function (component) {
        if (component) {
            var componentFactory = this._cfr.resolveComponentFactory(component);
            var componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
            this._viewCtrl._setInstance(componentRef.instance);
            this._enabled = true;
        }
    };
    PopoverCmp.prototype._setCssClass = function (componentRef, className) {
        this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
    };
    PopoverCmp.prototype._bdClick = function () {
        if (this._enabled && this.d.enableBackdropDismiss) {
            return this._viewCtrl.dismiss(null, 'backdrop');
        }
    };
    PopoverCmp.prototype._keyUp = function (ev) {
        if (this._enabled && ev.keyCode === Key.ESCAPE && this._viewCtrl.isLast()) {
            this._bdClick();
        }
    };
    PopoverCmp.decorators = [
        { type: Component, args: [{
                    selector: 'ion-popover',
                    template: '<ion-backdrop (click)="_bdClick()" [class.hide-backdrop]="!d.showBackdrop"></ion-backdrop>' +
                        '<div class="popover-wrapper">' +
                        '<div class="popover-arrow"></div>' +
                        '<div class="popover-content">' +
                        '<div class="popover-viewport">' +
                        '<div #viewport nav-viewport></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                },] },
    ];
    PopoverCmp.ctorParameters = [
        { type: ComponentFactoryResolver, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: Config, },
        { type: NavParams, },
        { type: ViewController, },
    ];
    PopoverCmp.propDecorators = {
        '_viewport': [{ type: ViewChild, args: ['viewport', { read: ViewContainerRef },] },],
        '_keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
    };
    return PopoverCmp;
}());
var popoverIds = -1;
//# sourceMappingURL=popover-component.js.map