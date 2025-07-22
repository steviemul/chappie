package io.steviemul.chappie.controller;

import io.steviemul.chappie.request.ChatOptions;
import io.steviemul.chappie.request.ChatRequest;
import io.steviemul.chappie.service.ChatService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class ChatController {

  private final ChatService chatService;

  @GetMapping("/chat")
  public Flux<String> chat(
      HttpSession session,
      ChatOptions chatOptions,
      ChatRequest chatRequest) {

    if (chatOptions.remember()) {
      return chatService.chat(chatRequest.message(), session.getId());
    }

    return chatService.chat(chatRequest.message());
  }
}
