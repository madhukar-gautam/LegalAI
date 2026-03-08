package com.lexify.lawaggregator.chatbot.service;

import com.lexify.lawaggregator.chatbot.dto.ChatbotLawyerSuggestion;
import com.lexify.lawaggregator.chatbot.dto.ChatbotMessageResponse;
import com.lexify.lawaggregator.domain.Lawyer;
import com.lexify.lawaggregator.repo.LawyerRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ChatbotService {
  private static final String DISCLAIMER =
      "This is general legal information and not a substitute for advice from a licensed lawyer.";

  private static final Map<String, List<String>> PRACTICE_KEYWORDS = Map.of(
      "Family Law", List.of("divorce", "alimony", "maintenance", "custody", "domestic violence", "marriage"),
      "Property Law", List.of("property", "rent", "tenant", "landlord", "lease", "eviction", "sale deed"),
      "Criminal Law", List.of("fir", "bail", "police", "arrest", "cheque bounce", "ipc", "498a"),
      "Corporate Law", List.of("contract", "startup", "nda", "compliance", "agreement", "company"),
      "Intellectual Property", List.of("trademark", "copyright", "patent", "infringement", "intellectual property", "ip"),
      "Tax Law", List.of("tax", "gst", "income tax", "tds", "assessment"),
      "Immigration", List.of("immigration", "visa", "work permit", "residency", "deportation", "asylum")
  );
  private static final Map<String, String> CITY_ALIASES = Map.of(
      "gurgaon", "gurugram",
      "bangalore", "bengaluru",
      "bombay", "mumbai",
      "calcutta", "kolkata",
      "madras", "chennai"
  );

  private final LawyerRepo lawyerRepo;

  public ChatbotService(LawyerRepo lawyerRepo) {
    this.lawyerRepo = lawyerRepo;
  }

  public ChatbotMessageResponse replyTo(String message, String city) {
    String normalizedMessage = message == null ? "" : message.toLowerCase(Locale.ROOT);
    String practiceArea = detectPracticeArea(normalizedMessage);
    boolean cheapestIntent = isCheapestIntent(normalizedMessage);
    String normalizedCity = normalize(city);

    List<ChatbotLawyerSuggestion> suggestions = lawyerRepo.findAll().stream()
        .filter(lawyer -> normalizedCity == null || cityMatches(lawyer, normalizedCity))
        .filter(lawyer -> practiceArea.equals("General") || practiceMatches(lawyer, practiceArea))
        .sorted(bestComparator(cheapestIntent))
        .limit(3)
        .map(this::toSuggestion)
        .collect(Collectors.toList());

    String reply = buildReply(practiceArea, normalizedCity, cheapestIntent, suggestions.size());
    return new ChatbotMessageResponse(reply, practiceArea, DISCLAIMER, suggestions);
  }

  private String buildReply(String practiceArea, String city, boolean cheapestIntent, int results) {
    if ("General".equals(practiceArea)) {
      return "I could not confidently classify this issue yet. Share more detail (notice, contract, FIR, tax order, or family dispute) so I can refine guidance.";
    }
    String ranking = cheapestIntent ? "ranked by lowest consultation fee" : "ranked by highest rating";
    if (results == 0) {
      if (city != null) {
        return "This appears to be a " + practiceArea + " matter, but I found no lawyers in " + city + ". Try removing the city filter.";
      }
      return "This appears to be a " + practiceArea + " matter, but I found no matching lawyers right now.";
    }
    if (city != null) {
      return "This appears to be a " + practiceArea + " matter. I found " + results + " lawyer option(s) in " + city + ", " + ranking + ".";
    }
    return "This appears to be a " + practiceArea + " matter. I found " + results + " lawyer option(s), " + ranking + ".";
  }

  private String detectPracticeArea(String text) {
    for (Map.Entry<String, List<String>> entry : PRACTICE_KEYWORDS.entrySet()) {
      boolean matched = entry.getValue().stream().anyMatch(text::contains);
      if (matched) {
        return entry.getKey();
      }
    }
    return "General";
  }

  private String normalize(String value) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }

  private boolean cityMatches(Lawyer lawyer, String city) {
    if (lawyer.getCity() == null) {
      return false;
    }
    String normalizedInputCity = canonicalCity(city);
    String normalizedLawyerCity = canonicalCity(lawyer.getCity());
    return normalizedLawyerCity.equals(normalizedInputCity);
  }

  private boolean practiceMatches(Lawyer lawyer, String practiceArea) {
    if (lawyer.getPracticeAreas() == null) {
      return false;
    }
    String queryPractice = normalizePracticeToken(practiceArea);
    return lawyer.getPracticeAreas().stream()
        .filter(Objects::nonNull)
        .map(this::normalizePracticeToken)
        .anyMatch(p -> p.equals(queryPractice));
  }

  private boolean isCheapestIntent(String text) {
    return text.contains("cheap")
        || text.contains("cheapest")
        || text.contains("low fee")
        || text.contains("lowest fee")
        || text.contains("budget")
        || text.contains("affordable")
        || text.contains("lowest cost");
  }

  private Comparator<Lawyer> bestComparator(boolean cheapestIntent) {
    if (cheapestIntent) {
      return Comparator
          .comparing(this::safeFeeMin)
          .thenComparing((Lawyer l) -> l.getRatingAvg() == null ? 0.0 : l.getRatingAvg(), Comparator.reverseOrder());
    }
    return Comparator
        .comparing((Lawyer l) -> l.getRatingAvg() == null ? 0.0 : l.getRatingAvg(), Comparator.reverseOrder())
        .thenComparing(this::safeFeeMin);
  }

  private BigDecimal safeFeeMin(Lawyer lawyer) {
    return lawyer.getFeeMin() == null ? BigDecimal.valueOf(Double.MAX_VALUE) : lawyer.getFeeMin();
  }

  private String normalizePracticeToken(String value) {
    String normalized = value.toLowerCase(Locale.ROOT)
        .replace("&", " and ")
        .replaceAll("[^a-z0-9 ]", " ")
        .replaceAll("\\s+", " ")
        .trim();
    if (normalized.equals("ip")) {
      return "intellectual property";
    }
    if (normalized.endsWith(" law")) {
      return normalized.substring(0, normalized.length() - 4);
    }
    return normalized;
  }

  private String canonicalCity(String city) {
    String normalized = city.toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9 ]", " ")
        .replaceAll("\\s+", " ")
        .trim();
    return CITY_ALIASES.getOrDefault(normalized, normalized);
  }

  private ChatbotLawyerSuggestion toSuggestion(Lawyer lawyer) {
    return new ChatbotLawyerSuggestion(
        lawyer.getId(),
        lawyer.getUser() == null ? "Unknown" : lawyer.getUser().getName(),
        lawyer.getCity(),
        lawyer.getRatingAvg(),
        lawyer.getPracticeAreas()
    );
  }
}
