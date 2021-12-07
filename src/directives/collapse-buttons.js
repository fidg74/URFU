let observer = false;

function prepare_buttons (el) {
    const moreBtn = document.createElement('button');
    moreBtn.classList.add("btn", "btn-primary", "collapsed-btn", "mr-0", "pl-2", "pr-2", "more-button", );
    moreBtn.textContent = "•••";
    const hiddenBtnsWrapper = document.createElement('div');
    hiddenBtnsWrapper.classList.add("hidden", "hidden-buttons", );
    moreBtn.addEventListener('click', () => {
        if (hiddenBtnsWrapper.classList.contains("hidden")) {
            hiddenBtnsWrapper.classList.remove("hidden");
        } else {
            hiddenBtnsWrapper.classList.add("hidden");
        }
    });
    el.insertAdjacentElement('beforeend', moreBtn);
    moreBtn.insertAdjacentElement('beforeend', hiddenBtnsWrapper);
    document.body.addEventListener('click', event => {
        if (!(moreBtn == event.target || moreBtn.contains(event.target))) {
            if (!hiddenBtnsWrapper.classList.contains("hidden")) {
                hiddenBtnsWrapper.classList.add("hidden");
            }
        }
    });
}

function process_buttons (el) {
    const moreBtn = el.getElementsByClassName('more-button')[0];
    moreBtn.classList.add('collapsed-btn');
    const hiddenBtnsWrapper = el.getElementsByClassName('hidden-buttons')[0];
    hiddenBtnsWrapper.classList.add('hidden');
    hiddenBtnsWrapper.innerHTML = '';
    const btnMargin = 10;
    let buttons = [];
    el.getElementsByTagName('button').forEach(btn => {
        if (!btn.classList.contains('more-button')) {
            btn.classList.remove('collapsed-btn');
            buttons.push(btn);
        }
    });
    let btnSizes = [];
    let hiddenBtns = [];
    buttons.forEach(btn => btnSizes.push(btn.offsetWidth));
    let cloneClick = i => {
        buttons[i].click();
    };
    buttons.forEach((btn, i) => {
        let el = btn.cloneNode(true);
        el.addEventListener("click", () => { cloneClick(i); });
        hiddenBtns.push(el);
        hiddenBtnsWrapper.insertAdjacentElement('beforeend', el);
    });
    if (observer) {
        observer.unobserve(el);
    }
    observer = new ResizeObserver(() => {
        const maxWidth = el.clientWidth - 40;
        let btnWidth = 0;
        buttons.forEach((btn, i) => {
            btnWidth += btnMargin + btnSizes[i];
            if (btnWidth >= maxWidth && i > 0) {
                btn.classList.add("collapsed-btn");
                hiddenBtns[i].classList.remove("collapsed-btn");
            } else {
                btn.classList.remove("collapsed-btn");
                hiddenBtns[i].classList.add("collapsed-btn");
            }
        });
        if (btnWidth < maxWidth || btnSizes.length < 2) {
            moreBtn.classList.add("collapsed-btn");
        } else {
            moreBtn.classList.remove("collapsed-btn");
        }
    });
    observer.observe(el);
}

export default {
    inserted (el) {
        prepare_buttons(el);
        process_buttons(el);
    },
    componentUpdated (el) {
        process_buttons(el);
    },
}
