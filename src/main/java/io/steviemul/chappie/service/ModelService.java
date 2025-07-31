package io.steviemul.chappie.service;

import io.steviemul.chappie.controller.ModelController;
import io.steviemul.chappie.response.Models;
import io.steviemul.chappie.response.PullStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModelService {

  private final OllamaApi ollamaApi;
  private final String embeddingModelName;
  private final String defaultChatModelName;
  private final String chatBaseUrl;

  public Models getAvailableModels() {

    List<String> additionalModels = listChatModels();

    return new Models(defaultChatModelName, additionalModels);
  }

  public List<String> listChatModels() {
    return ollamaApi.listModels().models().stream()
        .filter(m -> !m.name().equals(embeddingModelName))
        .map(OllamaApi.Model::name)
        .collect(Collectors.toList());
  }

  public Flux<String > pullModel(String name) {

    OllamaApi.PullModelRequest request = new OllamaApi.PullModelRequest(name);

    return ollamaApi.pullModel(request)
        .map(OllamaApi.ProgressResponse::status);
  }

  public void deleteModels() {

    listChatModels()
        .stream().filter(n -> !n.equals(defaultChatModelName))
        .forEach(this::deleteModel);
  }

  public void deleteModel(String name) {

    // Need to manually make this rest call as the Ollama REST API
    // expects the name specified in the request body
    // and the ollamaApi client doesn't support that.
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    String url = chatBaseUrl + "/api/delete";

    headers.set(HttpHeaders.CONTENT_TYPE, "application/json");

    HttpEntity<DeleteBody> entity = new HttpEntity<>(new DeleteBody(name), headers);

    restTemplate
        .exchange(url, HttpMethod.DELETE, entity, Void.class);

  }

  private PullStatus progressResponseToPullStatus(OllamaApi.ProgressResponse progressResponse) {

    long completed = progressResponse.completed() != null ? progressResponse.completed() : 0;
    long total = progressResponse.total() != null ? progressResponse.total() : 1;

    float percentage = (completed / total) / 100;

    return new PullStatus(progressResponse.status(), (int) percentage);
  }

  private record DeleteBody(String name) {}
}
