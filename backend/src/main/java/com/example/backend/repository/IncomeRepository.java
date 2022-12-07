package com.example.backend.repository;

import com.example.backend.entity.Attachment;
import com.example.backend.entity.studyCenter.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IncomeRepository extends JpaRepository<Income, UUID> {
}
