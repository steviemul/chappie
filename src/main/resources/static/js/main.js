import { Chat } from "./modules/chat.mjs";

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

      console.log(`Chunk - ${chunkText}`);

      chat.addContent(chunkText);

      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  } catch (error) {
    console.error('Error streaming response : ', error)
  }
}

const ask = (message, remember, rag, tools) => {
  const queryParams = new URLSearchParams({
    remember,
    rag,
    tools,
    message
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

  document.getElementById('question').value = '';

  ask(question, remember, rag, tools);

  event.preventDefault();
};

const performFormUpload = evt => {

  const form = evt.target;

  const fd = new FormData(form);

  fetch('/rag', {method: 'POST', body: fd})
      .then(function(res) {

        M.toast({html: 'File uploaded successfully', classes: 'rounded'})

        form.reset();
      })
};

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById("form-question")
      .addEventListener("submit", handleFormSubmission);

  document.getElementById('clear-button')
      .addEventListener('click', () => {
        document.getElementById('answer').innerHTML = '';
      });

  document.getElementById('ragUpload').onsubmit = performFormUpload;
});