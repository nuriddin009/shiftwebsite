package com.example.backend.repository.shiftRepo;

import com.example.backend.entity.shift.FollowUs;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FollowUsRepo extends JpaRepository<FollowUs, UUID> {
    List<FollowUs> findAllByOrderByName();
}
