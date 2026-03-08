package com.lexify.lawaggregator.config;

import com.lexify.lawaggregator.domain.Lawyer;
import com.lexify.lawaggregator.domain.User;
import com.lexify.lawaggregator.repo.LawyerRepo;
import com.lexify.lawaggregator.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class DataLoader {

  @Bean
  CommandLineRunner seedData(UserRepo userRepo, LawyerRepo lawyerRepo) {
    return args -> {
      if (lawyerRepo.count() > 0) return;

      ClassPathResource resource = new ClassPathResource("data/indian_lawyers_seed.csv");

      try (BufferedReader reader = new BufferedReader(
          new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

        String line;
        boolean firstRow = true;

        while ((line = reader.readLine()) != null) {
          if (firstRow) {
            firstRow = false; // skip header
            continue;
          }
          if (line.isBlank()) continue;

          String[] cols = parseCsvLine(line);
          if (cols.length < 13) continue;

          User user = new User();
          user.setName(cols[0].trim());
          user.setEmail(cols[1].trim());
          user.setPhone(cols[2].trim());
          user.setRole(User.Role.valueOf(cols[3].trim()));
          user.setVerified(Boolean.parseBoolean(cols[4].trim()));
          user = userRepo.save(user);

          Lawyer lawyer = new Lawyer();
          lawyer.setUser(user);
          lawyer.setCity(cols[5].trim());
          lawyer.setYearsExp(Integer.parseInt(cols[6].trim()));
          lawyer.setRatingAvg(Double.parseDouble(cols[7].trim()));
          lawyer.setFeeMin(new BigDecimal(cols[8].trim()));
          lawyer.setFeeMax(new BigDecimal(cols[9].trim()));
          lawyer.setLanguages(splitList(cols[10]));
          lawyer.setPracticeAreas(splitList(cols[11]));
          lawyer.setBio(cols[12].trim());

          lawyerRepo.save(lawyer);
        }
      }
    };
  }

  private static List<String> splitList(String value) {
    if (value == null || value.isBlank()) return List.of();
    return Arrays.stream(value.split(","))
        .map(String::trim)
        .filter(s -> !s.isBlank())
        .collect(Collectors.toList());
  }

  /**
   * Handles simple CSV with quoted values and escaped quotes.
   */
  private static String[] parseCsvLine(String line) {
    List<String> values = new java.util.ArrayList<>();
    StringBuilder current = new StringBuilder();
    boolean inQuotes = false;

    for (int i = 0; i < line.length(); i++) {
      char ch = line.charAt(i);

      if (ch == '"') {
        if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
          current.append('"');
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch == ',' && !inQuotes) {
        values.add(current.toString());
        current.setLength(0);
      } else {
        current.append(ch);
      }
    }

    values.add(current.toString());
    return values.toArray(new String[0]);
  }
}
