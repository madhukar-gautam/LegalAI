package com.lexify.lawaggregator.chatbot.dto;

import java.util.List;

public record ChatbotMessageResponse(
    String reply,
    String suggestedPracticeArea,
    String disclaimer,
    List<ChatbotLawyerSuggestion> suggestedLawyers
) {}
