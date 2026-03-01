package com.lexify.lawaggregator.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(reg -> reg.requestMatchers("/v1/**","/swagger-ui.html","/swagger-ui/**","/v3/api-docs/**").permitAll().anyRequest().authenticated())
        .httpBasic(b -> {});
    return http.build();
  }
}
