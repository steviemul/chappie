import { Thinker } from "./chatThinker.mjs";

const THINK_OPENER = '<think>';
const THINK_CLOSER = '</think>';

class ChatBody extends HTMLDivElement {

  constructor() {

    super();

    this.className = 'row';
    this.thinking = false;

    const colElement = document.createElement('div');
    colElement.className = 'col-12';

    const thinkingElement = new Thinker();

    const contentElement = document.createElement('pre');

    contentElement.className = 'answer';

    //colElement.appendChild(thinkingElement);
    colElement.appendChild(contentElement);

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
      this.contentElement.innerHTML += content;
    }
  }

}

window.customElements.define('chappie-body', ChatBody, {extends: 'div'})

export { ChatBody };