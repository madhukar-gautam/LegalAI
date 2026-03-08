package com.lexify.lawaggregator.web;
import com.lexify.lawaggregator.dto.LawyerResponse;
import com.lexify.lawaggregator.repo.LawyerRepo;
import com.lexify.lawaggregator.domain.Lawyer;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.*;
@RestController @RequestMapping("/v1/lawyers") @CrossOrigin
public class LawyerController {
  private static final Map<String, String> CITY_ALIASES = Map.of(
      "gurgaon", "gurugram",
      "bangalore", "bengaluru",
      "bombay", "mumbai",
      "calcutta", "kolkata",
      "madras", "chennai"
  );

  private final LawyerRepo repo;
  public LawyerController(LawyerRepo repo){ this.repo = repo; }
  @GetMapping
  public List<LawyerResponse> search(@RequestParam(name = "city", required=false) String city,
                                     @RequestParam(name = "practice", required=false) String practice,
                                     @RequestParam(name = "expGte", required=false) Integer expGte){
    String cityQuery = normalize(city);
    String practiceQuery = normalize(practice);
    return repo.findAll().stream()
      .filter(l -> cityQuery==null || (l.getCity()!=null && canonicalCity(l.getCity()).equals(canonicalCity(cityQuery))))
      .filter(l -> practiceQuery==null || matchesPractice(l.getPracticeAreas(), practiceQuery))
      .filter(l -> expGte==null || (l.getYearsExp()!=null && l.getYearsExp()>=expGte))
      .sorted(Comparator.comparing((Lawyer l) -> l.getRatingAvg()==null?0.0:l.getRatingAvg()).reversed())
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  @GetMapping("/practice-areas")
  public List<String> practiceAreas() {
    return repo.findAll().stream()
        .map(Lawyer::getPracticeAreas)
        .filter(Objects::nonNull)
        .flatMap(List::stream)
        .filter(Objects::nonNull)
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .distinct()
        .sorted(String.CASE_INSENSITIVE_ORDER)
        .collect(Collectors.toList());
  }

  @GetMapping("/cities")
  public List<String> cities() {
    return repo.findAll().stream()
        .map(Lawyer::getCity)
        .filter(Objects::nonNull)
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .distinct()
        .sorted(String.CASE_INSENSITIVE_ORDER)
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public LawyerResponse get(@PathVariable("id") Long id) {
    return toResponse(repo.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lawyer not found")));
  }

  private LawyerResponse toResponse(Lawyer l) {
    return new LawyerResponse(
      l.getId(),
      l.getUser() == null ? null : l.getUser().getName(),
      l.getCity(),
      l.getYearsExp(),
      l.getLanguages(),
      l.getFeeMin(),
      l.getFeeMax(),
      l.getRatingAvg(),
      l.getPracticeAreas(),
      l.getBio(),
      l.getUser() != null && l.getUser().isVerified()
    );
  }

  private String normalize(String value) {
    if (value == null) return null;
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }

  private String canonicalCity(String value) {
    String normalized = value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9 ]", " ").replaceAll("\\s+", " ").trim();
    return CITY_ALIASES.getOrDefault(normalized, normalized);
  }

  private boolean matchesPractice(List<String> practiceAreas, String practiceQuery) {
    if (practiceAreas == null) return false;
    return practiceAreas.stream().filter(Objects::nonNull).anyMatch(p -> p.equalsIgnoreCase(practiceQuery));
  }
}
