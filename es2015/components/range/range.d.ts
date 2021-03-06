import { AfterViewInit, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, Renderer } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Config } from '../../config/config';
import { TimeoutDebouncer } from '../../util/debouncer';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { Item } from '../item/item';
import { PointerCoordinates } from '../../util/dom';
import { Haptic } from '../../util/haptic';
import { UIEventManager } from '../../util/ui-event-manager';
export declare const RANGE_VALUE_ACCESSOR: any;
export declare class RangeKnob implements OnInit {
    range: Range;
    _ratio: number;
    _val: number;
    _x: string;
    pressed: boolean;
    upper: boolean;
    constructor(range: Range);
    ratio: number;
    value: number;
    position(): void;
    ngOnInit(): void;
}
export declare class Range extends Ion implements AfterViewInit, ControlValueAccessor, OnDestroy {
    private _form;
    private _haptic;
    private _item;
    _dual: boolean;
    _pin: boolean;
    _disabled: boolean;
    _pressed: boolean;
    _labelId: string;
    _fn: Function;
    _active: RangeKnob;
    _start: PointerCoordinates;
    _rect: ClientRect;
    _ticks: any[];
    _barL: string;
    _barR: string;
    _min: number;
    _max: number;
    _step: number;
    _snaps: boolean;
    _debouncer: TimeoutDebouncer;
    _events: UIEventManager;
    value: any;
    color: string;
    mode: string;
    _bar: ElementRef;
    _slider: ElementRef;
    _knobs: QueryList<RangeKnob>;
    id: string;
    min: number;
    max: number;
    step: number;
    snaps: boolean;
    pin: boolean;
    debounce: number;
    dualKnobs: boolean;
    ionChange: EventEmitter<Range>;
    constructor(_form: Form, _haptic: Haptic, _item: Item, config: Config, elementRef: ElementRef, renderer: Renderer);
    ngAfterViewInit(): void;
    pointerDown(ev: UIEvent): boolean;
    pointerMove(ev: UIEvent): void;
    pointerUp(ev: UIEvent): void;
    setActiveKnob(current: PointerCoordinates, rect: ClientRect): void;
    updateKnob(current: PointerCoordinates, rect: ClientRect): void;
    updateBar(): void;
    createTicks(): void;
    updateTicks(): void;
    ratioToValue(ratio: number): number;
    valueToRatio(value: number): number;
    writeValue(val: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: any): void;
    disabled: boolean;
    readonly ratio: number;
    readonly ratioUpper: number;
    onChange(val: any): void;
    onTouched(): void;
    ngOnDestroy(): void;
}
export interface ClientRect {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    width?: number;
    height?: number;
    xOffset?: number;
    yOffset?: number;
}
