package com.example.backend.repository.shiftRepo;

import com.example.backend.entity.shift.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseRepo extends JpaRepository<Course, UUID> {
    List<Course> findAllByOrderByCreatedAtDesc();
}
