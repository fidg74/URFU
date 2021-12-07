export default {
    inserted (el) {
        const copyEl = document.createElement('div');
        const elDisplay = el.style.display;
        copyEl.style.height = el.offsetHeight + 'px';
        copyEl.className = el.className;
        el.classList.add('pin-bottom');
        el.parentNode.insertBefore(copyEl, el);

        const observeEl = document.createElement('div');
        el.parentNode.insertBefore(observeEl, copyEl);

        const options = {
            rootMargin: '0px',
            threshold: 1,
        }
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                copyEl.style.display = 'none';
                el.classList.remove('pin-bottom_on');
                el.classList.add('pin-bottom_off');
                document.body.classList.remove('pin-bottom-on');
            } else {
                copyEl.style.display = elDisplay;
                el.classList.add('pin-bottom_on');
                el.classList.remove('pin-bottom_off');
                document.body.classList.add('pin-bottom-on');
            }
        }, options);
        observer.observe(observeEl);
    }
}
