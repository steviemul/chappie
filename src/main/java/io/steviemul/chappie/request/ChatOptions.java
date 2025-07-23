package io.steviemul.chappie.request;

public record ChatOptions(Boolean remember, Boolean rag, Boolean tools) {

  public boolean isRemember() {
    return remember != null && remember.booleanValue();
  }

  public boolean isRag() {
    return rag != null && rag.booleanValue();
  }

  public boolean isTools() {
    return tools != null && tools.booleanValue();
  }
}
