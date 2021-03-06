var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Animation } from '../animations/animation';
import { isPresent } from '../util/util';
import { PageTransition } from './page-transition';
var DURATION = 500;
var EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
var OPACITY = 'opacity';
var TRANSFORM = 'transform';
var TRANSLATEX = 'translateX';
var OFF_RIGHT = '99.5%';
var OFF_LEFT = '-33%';
var CENTER = '0%';
var OFF_OPACITY = 0.8;
var SHOW_BACK_BTN_CSS = 'show-back-button';
export var IOSTransition = (function (_super) {
    __extends(IOSTransition, _super);
    function IOSTransition() {
        _super.apply(this, arguments);
    }
    IOSTransition.prototype.init = function () {
        _super.prototype.init.call(this);
        var enteringView = this.enteringView;
        var leavingView = this.leavingView;
        var opts = this.opts;
        this.duration(isPresent(opts.duration) ? opts.duration : DURATION);
        this.easing(isPresent(opts.easing) ? opts.easing : EASING);
        var backDirection = (opts.direction === 'back');
        var enteringHasNavbar = (enteringView && enteringView.hasNavbar());
        var leavingHasNavbar = (leavingView && leavingView.hasNavbar());
        if (enteringView) {
            var enteringPageEle = enteringView.pageRef().nativeElement;
            var enteringContent = new Animation(enteringView.contentRef());
            enteringContent.element(enteringPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
            this.add(enteringContent);
            if (backDirection) {
                enteringContent
                    .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
                    .fromTo(OPACITY, OFF_OPACITY, 1, true);
            }
            else {
                enteringContent
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
            }
            if (enteringHasNavbar) {
                var enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                var enteringNavBar = new Animation(enteringNavbarEle);
                this.add(enteringNavBar);
                var enteringTitle = new Animation(enteringNavbarEle.querySelector('ion-title'));
                var enteringNavbarItems = new Animation(enteringNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
                var enteringNavbarBg = new Animation(enteringNavbarEle.querySelector('.toolbar-background'));
                var enteringBackButton = new Animation(enteringNavbarEle.querySelector('.back-button'));
                enteringNavBar
                    .add(enteringTitle)
                    .add(enteringNavbarItems)
                    .add(enteringNavbarBg)
                    .add(enteringBackButton);
                enteringTitle.fromTo(OPACITY, 0.01, 1, true);
                enteringNavbarItems.fromTo(OPACITY, 0.01, 1, true);
                if (backDirection) {
                    enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
                    if (enteringView.enableBack()) {
                        enteringBackButton
                            .beforeAddClass(SHOW_BACK_BTN_CSS)
                            .fromTo(OPACITY, 0.01, 1, true);
                    }
                }
                else {
                    enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                    enteringNavbarBg
                        .beforeClearStyles([OPACITY])
                        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                    if (enteringView.enableBack()) {
                        enteringBackButton
                            .beforeAddClass(SHOW_BACK_BTN_CSS)
                            .fromTo(OPACITY, 0.01, 1, true);
                        var enteringBackBtnText = new Animation(enteringNavbarEle.querySelector('.back-button-text'));
                        enteringBackBtnText.fromTo(TRANSLATEX, '100px', '0px');
                        enteringNavBar.add(enteringBackBtnText);
                    }
                    else {
                        enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                    }
                }
            }
        }
        if (leavingView && leavingView.pageRef()) {
            var leavingPageEle = leavingView.pageRef().nativeElement;
            var leavingContent = new Animation(leavingView.contentRef());
            leavingContent.element(leavingPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
            this.add(leavingContent);
            if (backDirection) {
                leavingContent
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, CENTER, '100%');
            }
            else {
                leavingContent
                    .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                    .fromTo(OPACITY, 1, OFF_OPACITY)
                    .afterClearStyles([TRANSFORM, OPACITY]);
            }
            if (leavingHasNavbar) {
                var leavingNavbarEle = leavingPageEle.querySelector('ion-navbar');
                var leavingNavBar = new Animation(leavingNavbarEle);
                var leavingTitle = new Animation(leavingNavbarEle.querySelector('ion-title'));
                var leavingNavbarItems = new Animation(leavingNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
                var leavingNavbarBg = new Animation(leavingNavbarEle.querySelector('.toolbar-background'));
                var leavingBackButton = new Animation(leavingNavbarEle.querySelector('.back-button'));
                leavingNavBar
                    .add(leavingTitle)
                    .add(leavingNavbarItems)
                    .add(leavingBackButton)
                    .add(leavingNavbarBg);
                this.add(leavingNavBar);
                leavingBackButton.fromTo(OPACITY, 0.99, 0);
                leavingTitle.fromTo(OPACITY, 0.99, 0);
                leavingNavbarItems.fromTo(OPACITY, 0.99, 0);
                if (backDirection) {
                    leavingTitle.fromTo(TRANSLATEX, CENTER, '100%');
                    leavingNavbarBg
                        .beforeClearStyles([OPACITY])
                        .fromTo(TRANSLATEX, CENTER, '100%');
                    var leavingBackBtnText = new Animation(leavingNavbarEle.querySelector('.back-button-text'));
                    leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (300) + 'px');
                    leavingNavBar.add(leavingBackBtnText);
                }
                else {
                    leavingTitle
                        .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                        .afterClearStyles([TRANSFORM]);
                    leavingBackButton.afterClearStyles([OPACITY]);
                    leavingTitle.afterClearStyles([OPACITY]);
                    leavingNavbarItems.afterClearStyles([OPACITY]);
                }
            }
        }
    };
    return IOSTransition;
}(PageTransition));
//# sourceMappingURL=transition-ios.js.map