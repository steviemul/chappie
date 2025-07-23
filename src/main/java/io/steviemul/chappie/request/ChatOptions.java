package io.steviemul.chappie.request;

public record ChatOptions(Boolean remember, Boolean rag) {

  public boolean isRemember() {
    return remember != null && remember.booleanValue();
  }

  public boolean isRag() {
    return rag != null && rag.booleanValue();
  }
}
