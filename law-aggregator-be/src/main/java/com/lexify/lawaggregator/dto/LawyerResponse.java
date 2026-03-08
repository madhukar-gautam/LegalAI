package com.lexify.lawaggregator.dto;

import java.math.BigDecimal;
import java.util.List;

public record LawyerResponse(
    Long id,
    String name,
    String city,
    Integer yearsExp,
    List<String> languages,
    BigDecimal feeMin,
    BigDecimal feeMax,
    Double ratingAvg,
    List<String> practiceAreas,
    String bio,
    boolean verified
) {}
