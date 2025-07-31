import { Thinker } from "./chatThinker.mjs";

const THINK_OPENER = '<think>';
const THINK_CLOSER = '</think>';

const CODE_ICON = '<i class="bi bi-code"></i>';
const TEXT_ICON = '<i class="bi bi-justify-left"></i>';

const renderMarkdown = text => {
  const rendered = DOMPurify.sanitize(marked.parse(text));

  return rendered;
};

function toggleRender() {
  if (!this.rendered) {
    this.contentElement.innerHTML = renderMarkdown(this.content);
    this.renderToggler.innerHTML = TEXT_ICON;
    this.renderToggler.title = 'Show Raw Text';
    this.rendered = true;
  }
  else {
    this.contentElement.innerHTML = this.content;
    this.renderToggler.innerHTML = CODE_ICON;
    this.renderToggler.title = 'Render markdown';
    this.rendered = false;
  }
}

class ChatBody extends HTMLDivElement {

  constructor(index) {

    super();

    this.className = 'row';
    this.thinking = false;
    this.content = '';
    this.rendered = false;

    const colElement = document.createElement('div');
    colElement.className = 'col-12';

    const thinkingElement = new Thinker(index);

    const renderToggler = document.createElement('button');

    renderToggler.title = 'Render markdown';

    renderToggler.onclick = toggleRender.bind(this);

    renderToggler.className = 'btn btn-secondary renderer';
    
    renderToggler.innerHTML = CODE_ICON;

    const contentElement = document.createElement('pre');

    contentElement.className = 'answer';

    const containerElement = document.createElement('div');

    containerElement.className = 'border rounded';

    containerElement.appendChild(thinkingElement);
    containerElement.appendChild(renderToggler);
    containerElement.appendChild(contentElement);

    colElement.appendChild(containerElement);

    this.appendChild(colElement);

    this.thinkingElement = thinkingElement;
    this.contentElement = contentElement;
    this.renderToggler = renderToggler;
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

}

window.customElements.define('chappie-body', ChatBody, {extends: 'div'})

export { ChatBody };