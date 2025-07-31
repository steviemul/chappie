package io.steviemul.chappie.config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.ChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.memory.repository.jdbc.PostgresChatMemoryRepositoryDialect;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.model.tool.ToolCallingManager;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.OllamaEmbeddingModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.ollama.management.ModelManagementOptions;
import org.springframework.ai.ollama.management.PullModelStrategy;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class ChatConfig {

  public static final String VECTOR_STORE_TABLE = "vector_store_chappie";
  public static final String CHAT_MEMORY_TABLE = "spring_ai_chat_memory";
  
  private final OllamaApi ollamaApi;
  private final String defaultChatModelName;
  private final String embeddingModelName;
  private final JdbcTemplate jdbcTemplate;
  private final String chatBaseUrl;

  public ChatConfig(
      @Value("${spring.ai.chat.model}") String defaultChatModelName,
      @Value("${spring.ai.chat.base-url}") String chatBaseUrl,
      @Value("${spring.ai.embedding.model}") String embeddingModelName,
      JdbcTemplate jdbcTemplate) {

    this.ollamaApi = OllamaApi.builder()
        .baseUrl(chatBaseUrl)
        .build();

    this.chatBaseUrl = chatBaseUrl;
    this.defaultChatModelName = defaultChatModelName;
    this.embeddingModelName = embeddingModelName;
    this.jdbcTemplate = jdbcTemplate;
  }

  private final ModelManagementOptions modelManagementOptions = ModelManagementOptions.builder()
      .pullModelStrategy(PullModelStrategy.WHEN_MISSING)
      .build();

  @Bean
  public String chatBaseUrl() {
    return chatBaseUrl;
  }

  @Bean
  public ToolCallingManager toolCallingManager() {
    return ToolCallingManager.builder().build();
  }

  @Bean
  public String defaultChatModelName() {
    return defaultChatModelName;
  }

  @Bean
  public String embeddingModelName() {
    return embeddingModelName;
  }

  @Bean
  public OllamaApi ollamaApi() {
    return ollamaApi;
  }

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
        .model(defaultChatModelName)
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
        .model(embeddingModelName)
        .build();

    return OllamaEmbeddingModel.builder()
        .ollamaApi(ollamaApi)
        .defaultOptions(options)
        .modelManagementOptions(modelManagementOptions)
        .build();
  }

}
