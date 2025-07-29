class ChatHeader extends HTMLDivElement {

    constructor(question) {
        super();

        this.className = 'row';

        const headerElement = document.createElement('div');

        headerElement.className = 'col s12';

        const text = document.createElement('p');

        text.className = 'question right';

        text.innerHTML = question;

        headerElement.appendChild(text);

        this.appendChild(headerElement);
    }

}

window.customElements.define('chappie-header', ChatHeader, {extends: 'div'})

export { ChatHeader };