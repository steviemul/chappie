const showMessage = message => {

const toastElement = document.querySelector('#toastMessage .toast');

  const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

  const messageElement = document.querySelector('#toastMessage .toast-body');

  messageElement.innerText = message;

  toast.show();
};

const chatContainer = () => document.getElementById('chat-container')
const message = () => document.getElementById('message');
const remember = () => document.getElementById('remember');
const rag = () => document.getElementById('rag');
const tools = () => document.getElementById('tools');
const modelSelector = () => document.getElementById('select-model');
const questionForm = () => document.getElementById('form-question');
const pullModelDialog = () => document.getElementById('modalPullModel');
const ragForm = () => document.getElementById('ragUpload');
const themeSelector = () => document.getElementById('select-theme');
const clearHistoryButton = () => document.getElementById('clear-history');
const clearVectorsButton = () => document.getElementById('clear-vectors');
const pullModelButton = () => document.getElementById('btn-pull-model');
const pullModelStatusPanel = () => document.getElementById('pull-model-status');

const pullModelBootstrap = () => bootstrap.Modal.getInstance(pullModelDialog());

const pullModelInProgress = () => {
    pullModelButton().classList.add('disabled');
    pullModelButton().innerHTML = `
        <span class="spinner-border spinner-border-sm" ></span>
        <span role="status">Pulling...</span>
    `;
};

const pullModelFinished = () => {
    pullModelButton().classList.remove('disabled');
    pullModelButton().innerHTML = 'Pull Model';
    pullModelBootstrap().hide();
};

export default {
    chatContainer,
    message,
    remember,
    rag,
    tools,
    modelSelector,
    questionForm,
    ragForm,
    themeSelector,
    clearHistoryButton,
    clearVectorsButton,
    pullModelButton,
    pullModelStatusPanel,
    pullModelDialog,
    pullModelBootstrap,
    pullModelInProgress,
    pullModelFinished,
    showMessage
};