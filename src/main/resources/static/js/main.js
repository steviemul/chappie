import { Chat } from "./modules/chat.mjs";

let chatCount=0;

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

  const chat = new Chat(message, chatCount++);

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

  if (question.trim() !== '') {
    document.getElementById('question').value = '';

    ask(question, remember, rag, tools, model);
  }
 
  event.preventDefault();
};

const showMessage = msg => {

  const toastElement = document.querySelector('#toastMessage .toast');

  const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

  const messageElement = document.querySelector('#toastMessage .toast-body');

  messageElement.innerText = msg;

  toast.show();

};

const clearChatHistory = evt => {

  fetch('/history', {method: 'DELETE'})
      .then(function(res) {
        showMessage('Chat History cleared successfully');
      });
};

const clearVectorStore = evt => {

  fetch('/vectors', {method: 'DELETE'})
      .then(function(res) {
        showMessage('Vector store cleared successfully');
      });
};

const performFormUpload = evt => {

  const form = evt.target;

  const fd = new FormData(form);

  evt.preventDefault();

  fetch('/rag', {method: 'POST', body: fd})
      .then(function(res) {
        form.reset();
        
        showMessage('File uploaded successfully');
      });
};

const changeTheme = event => {
  const theme = event.target.value;
  const htmlElement = document.documentElement;

  htmlElement.setAttribute('data-bs-theme', theme);
};

const calcPercentage = (x, y) => {
  return (x / y) * 100;
};

async function pullModel () {

  try {
    const name = document.getElementById('model-name').value;

    const response = await fetch(`/models/${name}`);
    
    const statusPanel = document.getElementById('pull-model-status');

    const reader = response.body.getReader();

    const statuses = new Set();

    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        console.log('Pulling Stream complete');
        showMessage(`Model ${name} pulled successfully`)

        const modalElement = document.getElementById('modalPullModel');

        const modalPullModel = bootstrap.Modal.getInstance(modalElement);

        modalPullModel.hide();

        statusPanel.innerHTML = '';

        break;
      }

      const decoder = new TextDecoder();
      
      const status = decoder.decode(value, {stream: true}).trim();  
      
      console.log(`Status : ${status}`);

      statuses.add(status);
      
      statusPanel.innerHTML = status;
    }
  } catch (error) {
    console.error('Error streaming model response : ', error)
  }

};

document.addEventListener('DOMContentLoaded', () => {

  const formQuestion = document.getElementById('form-question');

  formQuestion.addEventListener("submit", handleFormSubmission);

  document.getElementById('ragUpload').onsubmit = performFormUpload;

  document.getElementById('select-theme').onchange = changeTheme;

  document.getElementById('clear-history').onclick = clearChatHistory;
  document.getElementById('clear-vectors').onclick = clearVectorStore;
  document.getElementById('btn-pull-model').onclick = pullModel;

  getModels().then(res => {
    const modelsSelect = document.getElementById('select-model');

    modelsSelect.innerHTML = '';

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