package com.lexify.lawaggregator.domain;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  private String name; @Column(unique=true) private String email; private String phone;
  @Enumerated(EnumType.STRING) private Role role; private boolean verified;
  public enum Role { USER, LAWYER, ADMIN }

  public Long getId() { return id; }
  public String getName() { return name; }
  public String getEmail() { return email; }
  public String getPhone() { return phone; }
  public Role getRole() { return role; }
  public boolean isVerified() { return verified; }

  public void setName(String name) { this.name = name; }
  public void setEmail(String email) { this.email = email; }
  public void setPhone(String phone) { this.phone = phone; }
  public void setRole(Role role) { this.role = role; }
  public void setVerified(boolean verified) { this.verified = verified; }
}
