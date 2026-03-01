package com.lexify.lawaggregator.repo;
import com.lexify.lawaggregator.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BookingRepo extends JpaRepository<Booking, Long> {}
