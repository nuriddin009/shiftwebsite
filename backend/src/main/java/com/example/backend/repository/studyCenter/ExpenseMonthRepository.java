package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.ExpenseMonth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpenseMonthRepository extends JpaRepository<ExpenseMonth, UUID> {


    Optional<ExpenseMonth> findByMonthAndYear(Integer month, Integer year);

}
