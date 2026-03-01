package com.lexify.lawaggregator.domain;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.util.List;
@Entity @Table(name="lawyers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lawyer {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @OneToOne(optional=false) @JoinColumn(name="user_id") private User user;
  private String barEnrollmentNo; private Integer yearsExp; private String city; private Double ratingAvg;
  private BigDecimal feeMin; private BigDecimal feeMax;
  @ElementCollection private List<String> languages;
  @ElementCollection private List<String> practiceAreas;
  @Column(length=2000) private String bio;
}
