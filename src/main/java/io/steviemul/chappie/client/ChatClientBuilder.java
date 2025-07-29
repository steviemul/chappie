package io.steviemul.chappie.client;

import io.steviemul.chappie.request.ChatOptions;
import io.steviemul.chappie.tools.WeatherTool;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ChatClientBuilder {

  private final ChatModel defaultChatModel;
  private final ChatMemory chatMemory;
  private final VectorStore vectorStore;
  private final OllamaApi ollamaApi;

  private static final String RAG_TEMPLATE_RESOURCE = "templates/QuestionAnswer.template";

  public ChatClient build(ChatOptions chatOptions) {

    List<Advisor> advisors = new ArrayList<>();

    if (chatOptions.isRemember()) {
      advisors.add(MessageChatMemoryAdvisor.builder(chatMemory).build());
    }

    if (chatOptions.isRag()) {
      advisors.add(QuestionAnswerAdvisor.builder(vectorStore)
          .promptTemplate(getRagTemplate())
          .build());
    }

    return ChatClient.builder(getChatModel(chatOptions.model()))
        .defaultAdvisors(advisors)
        .build();
  }

  private PromptTemplate getRagTemplate() {

    return PromptTemplate.builder()
        .resource(new ClassPathResource(RAG_TEMPLATE_RESOURCE))
        .build();
  }

  private ChatModel getChatModel(String name) {

    if (name == null || name.isEmpty()) {
      return defaultChatModel;
    }

    OllamaOptions ollamaOptions = OllamaOptions.builder()
        .model(name)
        .build();

    return OllamaChatModel.builder()
        .ollamaApi(ollamaApi)
        .defaultOptions(ollamaOptions)
        .build();
  }
}
