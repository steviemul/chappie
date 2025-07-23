package io.steviemul.chappie.controller;

import io.steviemul.chappie.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class RagController {

  private final RagService ragService;

  @PostMapping("/rag")
  public ResponseEntity<Void> uploadRag(@RequestParam("file") MultipartFile file) {

    ragService.saveFile(file);;

    return ResponseEntity.noContent().build();
  }
}
