package com.lexify.lawaggregator.dto;

import com.lexify.lawaggregator.domain.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record RegisterRequest(
    @NotBlank(message = "name is required") String name,
    @NotBlank(message = "email is required") @Email(message = "email must be valid") String email,
    @NotBlank(message = "phone is required") String phone,
    User.Role role,
    String city,
    Integer yearsExp,
    List<@Size(max = 60, message = "language must be <= 60 chars") String> languages,
    List<@Size(max = 100, message = "practiceArea must be <= 100 chars") String> practiceAreas,
    @Size(max = 2000, message = "bio must be <= 2000 chars") String bio,
    BigDecimal feeMin,
    BigDecimal feeMax
) {}
