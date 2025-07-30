import { ChatHeader} from "./chatHeader.mjs";
import { ChatBody } from "./chatBody.mjs";

class Chat extends HTMLDivElement {

    constructor(question) {
        super();

        this.className = 'row chat-session';

        const colElement = document.createElement('div');

        colElement.className = 'col-12';

        const header = new ChatHeader(question);

        this.body = new ChatBody();

        colElement.appendChild(header);
        colElement.appendChild(this.body);

        this.appendChild(colElement);
    }

    addContent(content) {
        this.body.append(content);
    }
}

window.customElements.define('chappie-chat', Chat, {extends: 'div'})

export { Chat };