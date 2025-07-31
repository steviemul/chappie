# Chappie

Chappie is a basic Spring AI Demo App, showing how to build a basic chatbot and implement different features.

The app is designed to be an easy way to get started with playing around with AI models locally, 
without needing to sign up for AI models or vector databases.

You can select any model that you have running in your Ollama instance through the selected option at the top of the page.

By default, there is 1 model available, which is pulled on startup if not available.

The default model used is **llama3.2** but this can be overridden by setting an environment variable.
For example to use a smaller model such as **llama3.2:1b**

```shell
export CHAT_MODEL=llama3.2:1b
```

The app shows how to use a few different features :

- Using conversation history.
- Using RAG using the Postgres PG vector extension.
- Integrating tools. Note there's currently a bug in spring-ai 1.0.0 meaning this currently is not functional.

## Running
The included docker compose file has all the dependencies required to run the app

- A ollama image to run Ollama AI models locally.
- A postgres database with the PG vector extension installed for RAG features.

```shell
docker compose up -d
```

To build and run from the command line, use maven.
```shell
mvn spring-boot:run
```

By default, the application will be available at http://localhost:15080

The port can be overwritten by setting the following environment variable.
```shell
export SERVER_PORT=.....
```

## UI

The UI has the following options
- Basic chat area to interact with the currently selected model.
- Option to enable chat history.
- Option to enable RAG.
- Option to enable tools. This is currently experimental due a bug in Spring AI.
- Option to upload documents for use with RAG. Only plaintext documents currently supported.
- Ability to pull additional models. See https://ollama.com/ for available models.
- Option to clear chat history from the DB.
- Option to clear the vector store used for RAG.

## Env Vars

The following env vars may be set
- CHAT_MODEL : The default chat model to use, pulled on startup if not available. Defaulted to **llama3.2**
- CHAT_BASE_URL : The URL of your Ollama instance, defaulted to http://localhost:11434
- EMBEDDING_MODEL : The default embedding model to use, defaulted to **nomic-embed-text:latest**

## Models

The UI allows you to pull models, but these can be pulled separately outside the app using the ollama cli.

```shell
ollama pull <MODEL_NAME>
```

