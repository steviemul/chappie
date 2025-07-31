package io.steviemul.chappie.controller;

import io.steviemul.chappie.response.Models;
import io.steviemul.chappie.service.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class ModelController {

  private final ModelService modelService;

  @GetMapping("/models")
  public Models getAvailableModels() {
    return modelService.getAvailableModels();
  }

  @GetMapping("/models/{name}")
  public Flux<String> pullModel(@PathVariable("name") String name) {
    return modelService.pullModel(name);
  }

  @DeleteMapping("/models/{name}")
  public ResponseEntity<Void> deleteModel(@PathVariable("name") String name) {

    modelService.deleteModel(name);

    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/models")
  public ResponseEntity<Void> deleteAllModels() {

    modelService.deleteModels();

    return ResponseEntity.noContent().build();
  }
}
