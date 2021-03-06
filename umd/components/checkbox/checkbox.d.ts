import { AfterContentInit, ElementRef, EventEmitter, OnDestroy, Renderer } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { Item } from '../item/item';
export declare const CHECKBOX_VALUE_ACCESSOR: any;
export declare class Checkbox extends Ion implements AfterContentInit, ControlValueAccessor, OnDestroy {
    private _form;
    private _item;
    _checked: boolean;
    _init: boolean;
    _disabled: boolean;
    _labelId: string;
    _fn: Function;
    id: string;
    color: string;
    mode: string;
    ionChange: EventEmitter<Checkbox>;
    constructor(config: Config, _form: Form, _item: Item, elementRef: ElementRef, renderer: Renderer);
    _click(ev: UIEvent): void;
    checked: boolean;
    _setChecked(isChecked: boolean): void;
    writeValue(val: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: any): void;
    disabled: boolean;
    onChange(isChecked: boolean): void;
    onTouched(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}
