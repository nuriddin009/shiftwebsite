package com.example.backend.repository;

import com.example.backend.entity.studyCenter.IncomeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IncomeTypeRepository extends JpaRepository<IncomeType, UUID> {

    IncomeType findByType(String type);

}
