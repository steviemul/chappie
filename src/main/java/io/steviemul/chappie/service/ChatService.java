package io.steviemul.chappie.service;

import io.steviemul.chappie.client.ChatClientBuilder;
import io.steviemul.chappie.request.ChatOptions;
import io.steviemul.chappie.response.Models;
import io.steviemul.chappie.tools.WeatherTool;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

  private final ChatClientBuilder chatClientBuilder;
  private final WeatherTool weatherTool;
  private final OllamaApi ollamaApi;
  private final String defaultChatModel;
  private final String embeddingModelName;

  public Flux<String> chat(String message, String conversationId, ChatOptions options) {

    return spec(message, conversationId, options)
        .stream()
        .content();
  }

  public Flux<OllamaApi.ProgressResponse> pullModel(String name) {
    OllamaApi.PullModelRequest request = new OllamaApi.PullModelRequest(name);

    return ollamaApi.pullModel(request);
  }

  public Models getAvailableModels() {

    List<String> additionalModels = ollamaApi.listModels().models().stream()
        .filter(m -> !m.name().equals(embeddingModelName))
        .map(OllamaApi.Model::name)
        .collect(Collectors.toList());

    return new Models(defaultChatModel, additionalModels);
  }

  private ChatClient.ChatClientRequestSpec spec(String message, String conversationId, ChatOptions options) {

    ChatClient.ChatClientRequestSpec spec = chatClientBuilder.build(options)
        .prompt()
        .user(message)
        .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId));

    if (options.isTools()) {
      spec = spec.tools(new WeatherTool());
    }

    return spec;
  }

}
