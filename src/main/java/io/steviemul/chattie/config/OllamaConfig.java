package io.steviemul.chattie.config;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.ollama.management.ModelManagementOptions;
import org.springframework.ai.ollama.management.PullModelStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaConfig {

  private final OllamaApi ollamaApi = OllamaApi.builder().build();
  private final String ollamaModel;

  public OllamaConfig(@Value("${spring.ai.ollama.model}") String ollamaModel) {
    this.ollamaModel = ollamaModel;
  }

  private final ModelManagementOptions modelManagementOptions = ModelManagementOptions.builder()
          .pullModelStrategy(PullModelStrategy.WHEN_MISSING)
          .build();


  @Bean
  public OllamaChatModel ollamaChatModel() {

    OllamaOptions ollamaOptions = OllamaOptions.builder()
            .model(ollamaModel)
            .build();

    return OllamaChatModel.builder()
            .ollamaApi(ollamaApi)
            .defaultOptions(ollamaOptions)
            .modelManagementOptions(modelManagementOptions)
            .build();
  }
}
