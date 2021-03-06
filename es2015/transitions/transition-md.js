import { Animation } from '../animations/animation';
import { isPresent } from '../util/util';
import { PageTransition } from './page-transition';
const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px';
const SHOW_BACK_BTN_CSS = 'show-back-button';
export class MDTransition extends PageTransition {
    init() {
        super.init();
        const enteringView = this.enteringView;
        const leavingView = this.leavingView;
        const opts = this.opts;
        const backDirection = (opts.direction === 'back');
        if (enteringView) {
            if (backDirection) {
                this.duration(isPresent(opts.duration) ? opts.duration : 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
            }
            else {
                this.duration(isPresent(opts.duration) ? opts.duration : 280).easing('cubic-bezier(0.36,0.66,0.04,1)');
                this.enteringPage
                    .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER, true)
                    .fromTo('opacity', 0.01, 1, true);
            }
            if (enteringView.hasNavbar()) {
                const enteringPageEle = enteringView.pageRef().nativeElement;
                const enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                const enteringNavBar = new Animation(enteringNavbarEle);
                this.add(enteringNavBar);
                const enteringBackButton = new Animation(enteringNavbarEle.querySelector('.back-button'));
                this.add(enteringBackButton);
                if (enteringView.enableBack()) {
                    enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
                }
                else {
                    enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                }
            }
        }
        if (leavingView && backDirection) {
            this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
            const leavingPage = new Animation(leavingView.pageRef());
            this.add(leavingPage.fromTo(TRANSLATEY, CENTER, OFF_BOTTOM).fromTo('opacity', 1, 0));
        }
    }
}
//# sourceMappingURL=transition-md.js.map