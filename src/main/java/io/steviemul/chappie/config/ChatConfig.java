package io.steviemul.chappie.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.ChatMemoryRepository;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.memory.repository.jdbc.PostgresChatMemoryRepositoryDialect;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.OllamaEmbeddingModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.ollama.management.ModelManagementOptions;
import org.springframework.ai.ollama.management.PullModelStrategy;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class ChatConfig {

  private static final String VECTOR_STORE_TABLE = "vector_store_chappie";

  private final OllamaApi ollamaApi = OllamaApi.builder().build();
  private final String chatModel;
  private final String embeddingModel;
  private final JdbcTemplate jdbcTemplate;

  public ChatConfig(
      @Value("${spring.ai.chat.model}") String chatModel,
      @Value("${spring.ai.embedding.model}") String embeddingModel,
      JdbcTemplate jdbcTemplate) {
    this.chatModel = chatModel;
    this.embeddingModel = embeddingModel;
    this.jdbcTemplate = jdbcTemplate;
  }

  private final ModelManagementOptions modelManagementOptions = ModelManagementOptions.builder()
      .pullModelStrategy(PullModelStrategy.WHEN_MISSING)
      .build();

  @Bean
  public ChatMemory chatMemory() {

    ChatMemoryRepository chatMemoryRepository = JdbcChatMemoryRepository.builder()
        .jdbcTemplate(jdbcTemplate)
        .dialect(new PostgresChatMemoryRepositoryDialect())
        .build();

    return MessageWindowChatMemory.builder()
        .chatMemoryRepository(chatMemoryRepository)
        .maxMessages(10)
        .build();
  }

  @Bean
  public OllamaChatModel ollamaChatModel() {

    OllamaOptions ollamaOptions = OllamaOptions.builder()
        .model(chatModel)
        .build();

    return OllamaChatModel.builder()
        .ollamaApi(ollamaApi)
        .defaultOptions(ollamaOptions)
        .modelManagementOptions(modelManagementOptions)
        .build();
  }

  @Bean
  public VectorStore ollamaRulesVectorStore(
      JdbcTemplate jdbcTemplate,
      EmbeddingModel embeddingModel) {

    return PgVectorStore.builder(jdbcTemplate, embeddingModel)
        .vectorTableName(VECTOR_STORE_TABLE)
        .build();
  }

  @Bean
  public EmbeddingModel embeddingModel() {

    OllamaOptions options = OllamaOptions.builder()
        .model(embeddingModel)
        .build();

    return OllamaEmbeddingModel.builder()
        .ollamaApi(ollamaApi)
        .defaultOptions(options)
        .modelManagementOptions(modelManagementOptions)
        .build();
  }

}
