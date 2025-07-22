package io.steviemul.chattie.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class ChatService {

  private final OllamaChatModel chatModel;

  public Flux<String> chat(String message) {
    return chatModel.stream(message);
  }
}
