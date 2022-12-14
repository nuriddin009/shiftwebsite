package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ExpenseMonthProjection {

    LocalDateTime getMonth();

    @Value("#{@expenseRepository.findByMonth( target.month )}")
    List<ExpenseProjection> getExpenses();
}
