package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ExpenseProjection {

    UUID getId();

    String getYear();

    String getMonthName();

    BigDecimal getAmount();

    @Value("#{@expenseRepository.getHistory(target.id)}")
    List<ExpenseHistoryProjection> getHistory();
}
