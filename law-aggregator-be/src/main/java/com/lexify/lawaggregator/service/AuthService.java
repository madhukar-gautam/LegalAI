package com.lexify.lawaggregator.service;

import com.lexify.lawaggregator.domain.Lawyer;
import com.lexify.lawaggregator.domain.User;
import com.lexify.lawaggregator.dto.RegisterRequest;
import com.lexify.lawaggregator.dto.RegisterResponse;
import com.lexify.lawaggregator.repo.LawyerRepo;
import com.lexify.lawaggregator.repo.UserRepo;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class AuthService {
  private final UserRepo userRepo;
  private final LawyerRepo lawyerRepo;

  public AuthService(UserRepo userRepo, LawyerRepo lawyerRepo) {
    this.userRepo = userRepo;
    this.lawyerRepo = lawyerRepo;
  }

  @Transactional
  public RegisterResponse register(RegisterRequest request) {
    String email = normalizeEmail(request.email());
    if (userRepo.findByEmail(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    User.Role role = request.role() == null ? User.Role.USER : request.role();

    User user = new User();
    user.setName(request.name().trim());
    user.setEmail(email);
    user.setPhone(request.phone().trim());
    user.setRole(role);
    user.setVerified(false);

    try {
      user = userRepo.save(user);
    } catch (DataIntegrityViolationException ex) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    Long lawyerId = null;
    if (role == User.Role.LAWYER) {
      Lawyer lawyer = new Lawyer();
      lawyer.setUser(user);
      lawyer.setCity(trimToNull(request.city()));
      lawyer.setYearsExp(request.yearsExp());
      lawyer.setLanguages(cleanList(request.languages()));
      lawyer.setPracticeAreas(cleanList(request.practiceAreas()));
      lawyer.setBio(trimToNull(request.bio()));
      lawyer.setFeeMin(request.feeMin());
      lawyer.setFeeMax(request.feeMax());
      lawyer = lawyerRepo.save(lawyer);
      lawyerId = lawyer.getId();
    }

    return new RegisterResponse(
        user.getId(),
        lawyerId,
        user.getName(),
        user.getEmail(),
        user.getPhone(),
        user.getRole(),
        user.isVerified()
    );
  }

  private String normalizeEmail(String email) {
    return email == null ? null : email.trim().toLowerCase();
  }

  private String trimToNull(String value) {
    if (value == null) return null;
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }

  private List<String> cleanList(List<String> values) {
    if (values == null) return null;
    List<String> cleaned = values.stream()
        .filter(Objects::nonNull)
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toList();
    return cleaned.isEmpty() ? null : cleaned;
  }
}
