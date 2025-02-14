package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorRepo extends JpaRepository<Mentor, UUID> {




}
