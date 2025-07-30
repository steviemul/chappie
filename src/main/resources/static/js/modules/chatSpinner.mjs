class ChatSpinner extends HTMLDivElement {

    constructor() {
        super();

        this.className = 'spinner-border';
        this.role = 'status';

        this.innerHTML = `<span class="visually-hidden"></span>`;
    }
}

window.customElements.define('chappie-spinner', ChatSpinner, {extends: 'div'})

export { ChatSpinner }