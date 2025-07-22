async function streamToElement(url, elementId) {

  try {
    const outputElement = document.getElementById(elementId);

    const response = await fetch(url);
    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        console.log('Stream complete');
        outputElement.innerHTML += '<br><div class="divider"></div>';
        break;
      }

      const chunkText = decoder.decode(value, {stream: true});

      outputElement.innerHTML += chunkText;

      outputElement.scrollTop = outputElement.scrollHeight;
    }
  } catch (error) {
    console.error('Error streaming response : ', error)
  }
}

const ask = (message, remember) => {
  streamToElement(`/chat?remember=${remember}&message=${message}`, 'answer');
};

const handleFormSubmission = event => {

  const question = document.getElementById('question').value;
  const remember = document.getElementById('remember').checked;

  document.getElementById('question').value = '';

  ask(question, remember);

  event.preventDefault();
};

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById("form-question")
      .addEventListener("submit", handleFormSubmission);
});