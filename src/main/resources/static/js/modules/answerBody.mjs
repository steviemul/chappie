class AnswerBody {

  constructor() {

    const bodyElement = document.createElement('div');

    bodyElement.className = 'collapsible-body';

    const contentElement = document.createElement('pre');

    bodyElement.appendChild(contentElement);

    this.element = bodyElement;
    this.contentElement = contentElement;
  }

  get element() {
    return this.element;
  }

  append(content) {
    this.contentElement.innerHTML += content;
  }

}

export { AnswerBody };