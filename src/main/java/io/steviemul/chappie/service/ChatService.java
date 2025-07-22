package io.steviemul.chappie.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ChatService {

  private final ChatClient memorableChatClient;
  private final ChatClient forgetfulChatClient;

  public ChatService(
      @Qualifier("memorableClient") ChatClient memorableChatClient,
      @Qualifier("forgetfulClient") ChatClient forgetfulChatClient) {

    this.memorableChatClient = memorableChatClient;
    this.forgetfulChatClient = forgetfulChatClient;
  }
  public Flux<String> chat(String message) {
    return forgetfulChatClient
        .prompt()
        .user(message)
        .stream()
        .content();
  }

  public Flux<String> chat(String message, String conversationId) {

    return memorableChatClient
        .prompt()
        .user(message)
        .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
        .stream()
        .content();
  }
}
