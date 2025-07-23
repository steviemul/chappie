package io.steviemul.chappie.client;

import io.steviemul.chappie.request.ChatOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ChatClientBuilder {

  private final ChatModel chatModel;
  private final ChatMemory chatMemory;
  private final VectorStore vectorStore;

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

    return ChatClient.builder(chatModel)
        .defaultAdvisors(advisors)
        .build();
  }

  private PromptTemplate getRagTemplate() {

    return PromptTemplate.builder()
        .resource(new ClassPathResource(RAG_TEMPLATE_RESOURCE))
        .build();
  }
}
