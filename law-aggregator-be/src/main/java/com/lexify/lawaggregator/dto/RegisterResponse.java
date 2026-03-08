package com.lexify.lawaggregator.dto;

import com.lexify.lawaggregator.domain.User;

public record RegisterResponse(
    Long userId,
    Long lawyerId,
    String name,
    String email,
    String phone,
    User.Role role,
    boolean verified
) {}
