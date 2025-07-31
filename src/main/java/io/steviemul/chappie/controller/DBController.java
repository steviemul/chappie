package io.steviemul.chappie.controller;

import io.steviemul.chappie.service.DBService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DBController {

  private final DBService dbService;

  @DeleteMapping("/vectors")
  public ResponseEntity<Void> clearVectorStore() {
    dbService.clearVectorStore();

    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/history")
  public ResponseEntity<Void> clearChatHistory() {
    dbService.clearChatHistory();

    return ResponseEntity.noContent().build();
  }
}
