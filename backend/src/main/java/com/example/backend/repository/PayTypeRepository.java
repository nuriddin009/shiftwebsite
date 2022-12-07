package com.example.backend.repository;

import com.example.backend.entity.studyCenter.IncomeType;
import com.example.backend.entity.studyCenter.PayType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PayTypeRepository extends JpaRepository<PayType, UUID> {
}
