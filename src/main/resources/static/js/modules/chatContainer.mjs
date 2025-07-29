class ChatContainer extends HTMLDivElement {

    constructor(question) {
        super();

        this.className = 'test';

        this.question = question;

        const answerContainer = document.createElement('li');
    }

}

window.customElements.define('chappie-chat-container', ChatContainer, {extends: 'div'})

export { ChatContainer };