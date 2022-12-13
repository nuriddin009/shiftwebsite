package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Expense;
import com.example.backend.projection.ExpenseHistoryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

//    @Query(value = "", nativeQuery = true)
//    List<ExpenseHistoryProjection> getHistory(String year, String month);
}
