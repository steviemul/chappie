# Chappie

Basic Spring AI Demo App, showing how to build a basic chatbot.

You can select any model that you have running in your Ollama instance through the select option at the top of the page.

By default, there is 1 default model, which is pulled on startup if not available.

The default model uses is **llama3.2:1b** but this can be overridden by setting an environment variable.
For example to use **llama3.2:1b**

```shell
export OLLAMA_MODEL=llama3.2:1b
```

To use additional models, just pull them in your ollama instance and they will show up in the available models list.
```shell
ollama pull qwen2.5-coder:latest
```

The app shows how to use a few different features :

- Using conversation history.
- Using RAG using the Postgres PG vector extension.
- Integrating tools. Note there's currently a bug in spring-ai 1.0.0 meaning this currently is not functional.

The included docker compose file has all the dependencies required to run the app

- A ollama image to run models locally.
- A postgres database with the PG vector extension installed.