package com.lexify.lawaggregator.repo;
import com.lexify.lawaggregator.domain.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LawyerRepo extends JpaRepository<Lawyer, Long> {}
