package io.steviemul.chappie.response;

import java.util.List;

public record Models(String defaultModel, List<String> additionalModels) {
}
