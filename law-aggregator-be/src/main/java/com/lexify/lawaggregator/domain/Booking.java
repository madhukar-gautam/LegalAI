package com.lexify.lawaggregator.domain;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.OffsetDateTime;
@Entity @Table(name="bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional=false) private User user;
  @ManyToOne(optional=false) private Lawyer lawyer;
  private OffsetDateTime startTs; private OffsetDateTime endTs;
  private String status; private BigDecimal price; private String paymentId;
}
