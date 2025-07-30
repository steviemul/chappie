import { Chat } from "./modules/chat.mjs";

async function getModels() {

  try {
    const response = await fetch('/models');

    if (response.ok) {
      return await response.json();
    }
  }
  catch (error) {
    console.error('Error fetching models', error);
  }
}

async function streamToChat(url, chat) {

  try {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const chatContainer = document.getElementById('chat-container');

    const decoder = new TextDecoder();

    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        console.log('Stream complete');
        break;
      }

      const chunkText = decoder.decode(value, {stream: true});

      console.debug(`Chunk - ${chunkText}`);

      chat.addContent(chunkText);

      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  } catch (error) {
    console.error('Error streaming response : ', error)
  }
}

const ask = (message, remember, rag, tools, model) => {
  const queryParams = new URLSearchParams({
    remember,
    rag,
    tools,
    message,
    model
  });

  const chat = new Chat(message);

  document.getElementById('chat-container')
      .appendChild(chat);

  streamToChat(`chat?${queryParams.toString()}`, chat);
};

const handleFormSubmission = event => {

  const question = document.getElementById('question').value;
  const remember = document.getElementById('remember').checked;
  const rag = document.getElementById('rag').checked;
  const tools = document.getElementById('tools').checked;
  const model = document.getElementById('select-model').value;

  document.getElementById('question').value = '';

  ask(question, remember, rag, tools, model);

  event.preventDefault();
};

const performFormUpload = evt => {

  const form = evt.target;

  const fd = new FormData(form);

  fetch('/rag', {method: 'POST', body: fd})
      .then(function(res) {

        form.reset();
      })
};

const changeTheme = event => {
  const theme = event.target.value;
  const htmlElement = document.documentElement;

  htmlElement.setAttribute('data-bs-theme', theme);
};

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById("form-question")
      .addEventListener("submit", handleFormSubmission);

  document.getElementById('ragUpload').onsubmit = performFormUpload;

  document.getElementById('select-theme').onchange = changeTheme;

  getModels().then(res => {
    const modelsSelect = document.getElementById('select-model');

    const defaultModel = res.defaultModel;
    const models = res.additionalModels;

    for (const model of models) {
      const option = document.createElement('option');
      option.value = model;
      option.text = model;

      modelsSelect.add(option);

      if (option.value === defaultModel) {
        option.selected = true;
      }
    }

    modelsSelect.value = defaultModel;
  });
});