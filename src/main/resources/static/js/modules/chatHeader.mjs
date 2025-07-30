class ChatHeader extends HTMLDivElement {

    constructor(question) {
        super();

        this.className = 'row';

        const headerElement = document.createElement('div');

        headerElement.className = 'col-12 question';

        const text = document.createElement('p');

        text.className = 'speech-bubble speech-bubble-bottom';
        
        text.innerHTML = question;

        headerElement.appendChild(text);

        this.appendChild(headerElement);
    }

}

window.customElements.define('chappie-header', ChatHeader, {extends: 'div'})

export { ChatHeader };