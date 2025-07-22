async function streamToElement(url, elementId) {

  try {
    const outputDiv = document.getElementById(elementId);

    const response = await fetch(url);
    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        console.log('Stream complete');
        outputDiv.innerHTML += '<br><div class="divider"></div><br>';
        break;
      }

      const chunkText = decoder.decode(value, { stream: true });

      const htmlChunk = chunkText.replace(/\n/g, '<br>');

      outputDiv.innerHTML += htmlChunk;
    }
  }
  catch (error) {
    console.error('Error streaming response : ', error)
  }
}

const ask = message => {
  streamToElement(`/chat?message=${message}`, 'answer');
};

const handleFormSubmission = event => {

  const question = document.getElementById('question').value;

  document.getElementById('question').value = '';

  ask(question);

  event.preventDefault();
};

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById("form-question")
      .addEventListener("submit", handleFormSubmission);
});