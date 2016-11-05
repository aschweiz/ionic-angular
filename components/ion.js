import { getDimensions, clearDimensions } from '../util/dom';
export var Ion = (function () {
    function Ion(config, elementRef, renderer) {
        this._config = config;
        this._elementRef = elementRef;
        this._renderer = renderer;
    }
    Ion.prototype.setElementClass = function (className, isAdd) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, isAdd);
    };
    Ion.prototype.setElementAttribute = function (attributeName, attributeValue) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, attributeValue);
    };
    Ion.prototype.setElementStyle = function (property, value) {
        this._renderer.setElementStyle(this._elementRef.nativeElement, property, value);
    };
    Ion.prototype._setColor = function (componentName, newColor) {
        if (this._color) {
            this.setElementClass(componentName + "-" + this._mode + "-" + this._color, false);
        }
        if (newColor) {
            this.setElementClass(componentName + "-" + this._mode + "-" + newColor, true);
            this._color = newColor;
        }
    };
    Ion.prototype._setMode = function (componentName, newMode) {
        if (this._mode) {
            this.setElementClass(componentName + "-" + this._mode, false);
        }
        if (newMode) {
            this.setElementClass(componentName + "-" + newMode, true);
            this._setColor(componentName, null);
            this._mode = newMode;
            this._setColor(componentName, this._color);
        }
    };
    Ion.prototype.getElementRef = function () {
        return this._elementRef;
    };
    Ion.prototype.getNativeElement = function () {
        return this._elementRef.nativeElement;
    };
    Ion.prototype.getDimensions = function () {
        return getDimensions(this.getNativeElement(), this._getId());
    };
    Ion.prototype.width = function () {
        return getDimensions(this.getNativeElement(), this._getId()).width;
    };
    Ion.prototype.height = function () {
        return getDimensions(this.getNativeElement(), this._getId()).height;
    };
    Ion.prototype.destroy = function () {
        clearDimensions(this._ionId);
    };
    Ion.prototype._getId = function () {
        if (!this._ionId) {
            this._ionId = 'i' + ids++;
        }
        return this._ionId;
    };
    return Ion;
}());
var ids = 0;
//# sourceMappingURL=ion.js.map