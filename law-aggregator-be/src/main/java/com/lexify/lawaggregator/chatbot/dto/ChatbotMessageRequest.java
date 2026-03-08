package com.lexify.lawaggregator.chatbot.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatbotMessageRequest(
    @NotBlank(message = "message is required")
    String message,
    String city
) {}
