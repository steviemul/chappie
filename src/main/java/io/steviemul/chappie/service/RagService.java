package io.steviemul.chappie.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

  private static final String FILENAME = "filename";

  private final VectorStore vectorStore;

  public void saveFile(MultipartFile file) {

    try {
      String fileName = file.getOriginalFilename();
      String contents = new String(file.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

      TokenTextSplitter tokenTextSplitter = new TokenTextSplitter();

      Document document = new Document(
          contents,
          Map.of(FILENAME, fileName));

      vectorStore.accept(tokenTextSplitter.split(document));
    }
    catch (Exception e) {
      log.error("Unable to save file", e);
    }
  }
}
