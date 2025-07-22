package io.steviemul.chattie.controller;

import io.steviemul.chattie.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class ChatController {

  private final ChatService chatService;

  @GetMapping("/chat")
  public Flux<String> chat(@RequestParam String message) {
    return chatService.chat(message);
  }
}
