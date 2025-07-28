# Chappie

Basic Spring AI Demo App, showing how to build a basic chat bot.

By default, this app used the llama3.2 model. If running locally on a lower powered machine, the model can be changed by setting an env var e.g. to use llama3.2:1b :
```shell
export OLLAMA_MODEL=llama3.2:1b
```

The app shows how to use a few different features :

- Using conversation history.
- Using RAG using the Postgres PG vector extension.
- Integrating tools. Note there's currently a bug in spring-ai 1.0.0 meaning this currently is not functional.

The included docker compose file has all the dependencies required to run the app

- A ollama image to run models locally.
- A postgres database with the PG vector extension installed.