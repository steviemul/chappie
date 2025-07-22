package io.steviemul.chappie.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.ollama.management.ModelManagementOptions;
import org.springframework.ai.ollama.management.PullModelStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatConfig {

  private final OllamaApi ollamaApi = OllamaApi.builder().build();
  private final String ollamaModel;

  public ChatConfig(@Value("${spring.ai.ollama.model}") String ollamaModel) {
    this.ollamaModel = ollamaModel;
  }

  private final ModelManagementOptions modelManagementOptions = ModelManagementOptions.builder()
      .pullModelStrategy(PullModelStrategy.WHEN_MISSING)
      .build();

  private ChatMemory chatMemory() {

    return MessageWindowChatMemory.builder()
        .chatMemoryRepository(new InMemoryChatMemoryRepository())
        .maxMessages(10)
        .build();
  }

  private OllamaChatModel ollamaChatModel() {

    OllamaOptions ollamaOptions = OllamaOptions.builder()
        .model(ollamaModel)
        .build();

    return OllamaChatModel.builder()
        .ollamaApi(ollamaApi)
        .defaultOptions(ollamaOptions)
        .modelManagementOptions(modelManagementOptions)
        .build();
  }

  @Bean("memorableClient")
  public ChatClient memorableClient() {
    return ChatClient.builder(ollamaChatModel())
        .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory()).build())
        .build();
  }

  @Bean("forgetfulClient")
  public ChatClient forgetfulClient() {
    return ChatClient.builder(ollamaChatModel())
        .build();
  }
}
