import { offsetTop } from '@/utils';

const copyEl = document.createElement('div');

export default {
    inserted (el) {
        el.dataset.isFixed = false;
        el.dataset.maxTop = offsetTop(el);
        copyEl.style.cssText = `height: 100vh; display: none;`;
        copyEl.className = el.className;
        el.parentNode.insertBefore(copyEl, el);
    },
    bind (el, { value }) {
        let lastPosition = -74;
        let isFixed = false;
        let oldIsFixed = true;

        el.classList.add('pin-aside');

        const scrollElem = document.querySelector('.shell-main');
        const scrollElemContent = document.querySelector('.shell-main');
        const appFooter = document.querySelector('.app__footer');
        setTimeout(() => {
            if (window.screen.width > 575) {
                el.style.cssText = `width: auto; max-height: calc(100vh - ${ offsetTop(el) + 104 }px)`;
            }
        }, 10);

        scrollElem.addEventListener('scroll', () => {
            lastPosition = (window.pageYOffset || scrollElem.scrollTop)  - (scrollElem.clientTop || -74); // если shell-main будет поправлен, нужно будет проверить
            lastPosition = lastPosition ? lastPosition : 74;
            isFixed = (el.dataset.maxTop < lastPosition - (value ? value : 0));
            el.dataset.isFixed = isFixed;

            if (window.screen.width > 575) {
                if (!isFixed) {
                    // console.log(offsetTop(el) - lastPosition + 104);
                    // console.log(offsetTop(el), '-', lastPosition, 104);
                    el.style.cssText = `width: auto; max-height: calc(100vh - ${ offsetTop(el) - lastPosition + 104 }px)`;
                    copyEl.style.display = 'none';
                } else {
                    copyEl.style.display = 'block';
                    const scrollToFooter = (document.body.offsetHeight + lastPosition + appFooter.offsetHeight) - scrollElemContent.scrollHeight;
                    el.style.maxHeight = `calc(100vh - ${ scrollToFooter > 20 ? (84 + scrollToFooter) : 104 }px)`;
                }
                if (oldIsFixed !== isFixed) {
                    oldIsFixed = isFixed;
                    if (isFixed) {
                        el.style.width = el.offsetWidth + 'px';
                        el.classList.remove('pin-aside_off');
                        el.classList.add('pin-aside_on');
                    } else {
                        el.style.width = 'auto';
                        el.classList.remove('pin-aside_on');
                        el.classList.add('pin-aside_off');
                    }
                }
            }
        });
    }
}
