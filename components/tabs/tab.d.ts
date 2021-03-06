import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../util/keyboard';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavOptions } from '../../navigation/nav-util';
import { TabButton } from './tab-button';
import { Tabs } from './tabs';
import { TransitionController } from '../../transitions/transition-controller';
import { ViewController } from '../../navigation/view-controller';
export declare class Tab extends NavControllerBase {
    private _cd;
    private linker;
    _isInitial: boolean;
    _isEnabled: boolean;
    _isShown: boolean;
    _tabId: string;
    _btnId: string;
    _loaded: boolean;
    isSelected: boolean;
    btn: TabButton;
    _tabsHideOnSubPages: boolean;
    root: any;
    rootParams: any;
    tabUrlPath: string;
    tabTitle: string;
    tabIcon: string;
    tabBadge: string;
    tabBadgeStyle: string;
    enabled: boolean;
    show: boolean;
    swipeBackEnabled: boolean;
    tabsHideOnSubPages: boolean;
    ionSelect: EventEmitter<Tab>;
    constructor(parent: Tabs, app: App, config: Config, keyboard: Keyboard, elementRef: ElementRef, zone: NgZone, renderer: Renderer, cfr: ComponentFactoryResolver, _cd: ChangeDetectorRef, gestureCtrl: GestureController, transCtrl: TransitionController, linker: DeepLinker);
    _vp: ViewContainerRef;
    ngOnInit(): void;
    load(opts: NavOptions, done?: Function): void;
    _viewAttachToDOM(viewCtrl: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef): void;
    setSelected(isSelected: boolean): void;
    readonly index: number;
    updateHref(component: any, data: any): void;
    destroy(): void;
}
