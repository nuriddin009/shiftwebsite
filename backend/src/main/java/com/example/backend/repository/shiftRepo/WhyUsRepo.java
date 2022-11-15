package com.example.backend.repository.shiftRepo;

import com.example.backend.entity.shift.WhyUS;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WhyUsRepo extends JpaRepository<WhyUS, UUID> {
    List<WhyUS> findAllByOrderByCreatedAtDesc();

}
