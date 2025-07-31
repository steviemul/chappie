import { ChatSpinner } from "./chatSpinner.mjs";

class Thinker extends HTMLDivElement {

    constructor(index) {
        super();

        this.className = 'accordion accordion-flush';
        this.id = `thinking-container-${index}`;

        const item = document.createElement('div');

        item.className = 'accordion-item';

        const header = document.createElement('h2');
        header.className = 'accordion-header';

        const toggler = document.createElement('button');
        const spinner = new ChatSpinner();
        const togglerText = document.createElement('span');

        togglerText.innerText = 'Show Thinking';
        togglerText.className = 'm-2';

        toggler.className = 'accordion-button collapsed d-none align-middle';
        toggler.type = 'button';
        toggler.setAttribute('data-bs-toggle', 'collapse');
        toggler.setAttribute('data-bs-target', `#thinking-panel-${index}`);

        toggler.appendChild(spinner);
        toggler.appendChild(togglerText);

        toggler.addEventListener('hidden.bs.collapse', () => {
            togglerText.innerText = 'Show Thinking';
        });

        toggler.addEventListener('shown.bs.collapse', () => {
            togglerText.innerText = 'Hide Thinking';
        });

        header.appendChild(toggler);

        item.appendChild(header);

        const panel = document.createElement('div');

        panel.id = `thinking-panel-${index}`;
        panel.className = 'accordion-collapse collapse';

        const panelBody = document.createElement('div');
        panelBody.className = 'accordion-body';

        panel.appendChild(panelBody);

        const contentElement = document.createElement('pre');

        panelBody.appendChild(contentElement);

        item.appendChild(panel);

        this.appendChild(item);

        this.toggler = toggler;
        this.spinner = spinner;
        this.togglerText = togglerText;
        this.contentElement = contentElement;
    }

    connectedCallback() {

    }

    append(content) {
        this.contentElement.innerHTML += content;
    }

    start() {
        this.toggler.classList.remove('d-none');
    }

    finish() {
        this.toggler.removeChild(this.spinner);
        this.togglerText.innerText = 'Finished Thinking';
    }
}

window.customElements.define('chappie-thinker', Thinker, {extends: 'div'})

export { Thinker }