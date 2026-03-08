package com.lexify.lawaggregator.chatbot.dto;

import java.util.List;

public record ChatbotLawyerSuggestion(
    Long id,
    String name,
    String city,
    Double ratingAvg,
    List<String> practiceAreas
) {}
