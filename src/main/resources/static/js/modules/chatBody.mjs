import { Thinker } from "./chatThinker.mjs";

const THINK_OPENER = '<think>';
const THINK_CLOSER = '</think>';

const renderMarkdown = text => {
  const rendered = DOMPurify.sanitize(marked.parse(text));

  return rendered;
};

class ChatBody extends HTMLDivElement {

  constructor(index) {

    super();

    this.className = 'row';
    this.thinking = false;
    this.content = '';

    const colElement = document.createElement('div');
    colElement.className = 'col-12';

    const thinkingElement = new Thinker(index);

    const contentElement = document.createElement('pre');

    contentElement.className = 'answer';

    const containerElement = document.createElement('div');

    containerElement.className = 'border rounded';

    containerElement.appendChild(thinkingElement);
    containerElement.appendChild(contentElement);

    colElement.appendChild(containerElement);

    this.appendChild(colElement);

    this.thinkingElement = thinkingElement;
    this.contentElement = contentElement;
  }

  append(content) {

    if (content.trim() === THINK_OPENER) {
      console.log('Started Thinking');
      this.thinking = true;
      this.thinkingElement.start();
      return;
    }

    if (content.trim() === THINK_CLOSER) {
      console.log('Finished Thinking');
      this.thinking = false;
      this.thinkingElement.finish();
      return;
    }

    if (this.thinking) {
      this.thinkingElement.append(content);
    }
    else {
      this.content += content;
      this.contentElement.innerHTML += content;
    }
  }

  finished() {

  }

  renderMarkdown() {
    this.contentElement.innerHTML = renderMarkdown(content);
  }

  renderRaw() {
    this.contentElement.innerHTML = this.content;
  }

}

window.customElements.define('chappie-body', ChatBody, {extends: 'div'})

export { ChatBody };