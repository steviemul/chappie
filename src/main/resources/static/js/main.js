import { Chat } from "./modules/chat.mjs";
import ui from "./modules/uiSelector.mjs";

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
    const chatContainer = ui.chatContainer();

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

const ask = (params) => {
  const queryParams = new URLSearchParams(params);

  const {message} = params;

  const chat = new Chat(message, chatCount++);

  ui.chatContainer().appendChild(chat);

  streamToChat(`chat?${queryParams.toString()}`, chat);
};

const handleFormSubmission = event => {

  const message = ui.message().value;
  const remember = ui.remember().checked;
  const rag = ui.rag().checked;
  const tools = ui.tools().checked;
  const model = ui.modelSelector().value;

  if (message.trim() !== '') {
    ui.message().value = '';

    ask({
      message, 
      remember, 
      rag, 
      tools, 
      model
    });
  }
 
  event.preventDefault();
};

const clearChatHistory = () => {

  fetch('/history', {method: 'DELETE'})
      .then(function(res) {
        if (res.ok) {
          ui.showMessage('Chat History cleared successfully');
        }
      });
};

const clearVectorStore = evt => {

  fetch('/vectors', {method: 'DELETE'})
      .then(function(res) {
        ui.showMessage('Vector store cleared successfully');
      });
};

const performFormUpload = evt => {

  const form = evt.target;

  const fd = new FormData(form);

  evt.preventDefault();

  fetch('/rag', {method: 'POST', body: fd})
      .then(function(res) {
        form.reset();
        
        ui.showMessage('File uploaded successfully');
      });
};

const changeTheme = event => {
  const theme = event.target.value;
  const htmlElement = document.documentElement;

  htmlElement.setAttribute('data-bs-theme', theme);
};

async function refreshModels() {

  const res = await getModels();

  const modelsSelect = ui.modelSelector();

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

}

const dots = (max) => {

  let index = 0;

  const interval = setInterval(() => {
    index = (index > max) ? 0 : index + 1;
  }, 1500);

  return {
    value : () => ' .'.repeat(index),
    finished : () => {
      clearInterval(interval);
    }
  };
}

async function pullModel () {

  try {
    const name = document.getElementById('model-name').value;

    const response = await fetch(`/models/${name}`);
    
    const statusPanel = ui.pullModelStatusPanel();

    const reader = response.body.getReader();

    ui.pullModelInProgress();

    let index = 0;

    const progress = dots(10);

    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        progress.finished();
        console.log('Pulling Stream complete');
        ui.showMessage(`Model ${name} pulled successfully`)

        ui.pullModelFinished();

        statusPanel.innerHTML = '';
        
        refreshModels();
        
        break;
      }

      const decoder = new TextDecoder();
      
      const status = decoder.decode(value, {stream: true}).trim();  
      
      const dots = ' .'.repeat(index++);

      statusPanel.innerHTML = status + progress.value();

      console.debug(`Status : ${statusPanel.innerHTML}`);
      
      if (index > 10) index = 0;
    }
  } catch (error) {
    progress.finished();
    ui.pullModelFinished();
    console.error('Error streaming model response : ', error)
  }
};

const deleteModel = () => {

  const model = ui.modelSelector().value;

  fetch(`/models/${model}`, {method: 'DELETE'})
      .then(res => {
        if (res.ok) {
          ui.showMessage(`Model ${model} deleted successfully`);
          refreshModels();
        }
      });
};

document.addEventListener('DOMContentLoaded', () => {

  const questionForm = ui.questionForm();
  const ragForm = ui.ragForm();

  questionForm.addEventListener('submit', handleFormSubmission);
  ragForm.addEventListener('submit', performFormUpload);

  ui.themeSelector().onchange = changeTheme;

  ui.clearHistoryButton().onclick = clearChatHistory;
  ui.clearVectorsButton().onclick = clearVectorStore;
  ui.pullModelButton().onclick = pullModel;
  ui.deleteModelButton().onclick = deleteModel;

  refreshModels();
});