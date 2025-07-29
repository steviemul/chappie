import { ChatSpinner } from "./chatSpinner.mjs";

class Thinker extends HTMLUListElement {

    constructor() {
        super();

        this.className = 'collapsible expandable hide';

        const liElement = document.createElement('li');

        const header = document.createElement('div');
        header.className = 'collapsible-header valign-wrapper';

        const spinner = new ChatSpinner();

        const text = document.createElement('div');

        text.innerText = 'Show Thinking';

        header.appendChild(text);
        header.appendChild(spinner);

        this.headerText = text;

        liElement.appendChild(header);

        const body = document.createElement('div');
        body.className = 'collapsible-body';

        const contentElement = document.createElement('pre');
        body.appendChild(contentElement);

        liElement.appendChild(body);

        this.appendChild(liElement);

        this.header = header;
        this.contentElement = contentElement;
    }

    connectedCallback() {
        M.Collapsible.init(this, {
            onOpenEnd : () => {
                this.headerText.innerText = 'Hide Thinking';
            },
            onCloseEnd: () => {
                this.headerText.innerText = 'Show Thinking';
            }
        });
    }

    append(content) {
        this.contentElement.innerHTML += content;
    }

    start() {
        this.classList.remove('hide');
    }

    finish() {
        this.header.innerHTML = 'Finished Thinking <i class="material-icons">check</i>';
    }
}

window.customElements.define('chappie-thinker', Thinker, {extends: 'ul'})

export { Thinker }