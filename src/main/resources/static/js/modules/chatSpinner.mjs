class ChatSpinner extends HTMLDivElement {

    constructor() {
        super();

        this.className = 'progress';

        this.innerHTML = `<div class="indeterminate"></div>`;
    }

    start() {
        this.classList.add('active');
    }

    stop() {
        this.classList.remove('active');
    }
}

window.customElements.define('chappie-spinner', ChatSpinner, {extends: 'div'})

export { ChatSpinner }