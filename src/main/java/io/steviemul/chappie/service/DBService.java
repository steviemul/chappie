package io.steviemul.chappie.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import static io.steviemul.chappie.config.ChatConfig.CHAT_MEMORY_TABLE;
import static io.steviemul.chappie.config.ChatConfig.VECTOR_STORE_TABLE;

@Service
@RequiredArgsConstructor
public class DBService {

  private final JdbcTemplate jdbcTemplate;

  public void clearChatHistory() {
    jdbcTemplate.execute("DELETE FROM " + CHAT_MEMORY_TABLE);
  }

  public void clearVectorStore() {
    jdbcTemplate.execute("DELETE FROM " + VECTOR_STORE_TABLE);
  }
}
