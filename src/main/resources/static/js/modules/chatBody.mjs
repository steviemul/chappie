class ChatBody extends HTMLDivElement {

  constructor() {

    super();

    this.className = 'row';

    const colElement = document.createElement('div');
    colElement.className = 'col s12';

    const contentElement = document.createElement('pre');

    contentElement.className = 'answer';

    colElement.appendChild(contentElement);

    this.appendChild(colElement);

    this.contentElement = contentElement;
  }

  append(content) {
    this.contentElement.innerHTML += content;
  }

}

window.customElements.define('chappie-body', ChatBody, {extends: 'div'})

export { ChatBody };