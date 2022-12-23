package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

public interface BalanceProjection {
    String getType();
    String getId();
    @Value("#{@incomeRepository.getIncome(target.id)}")
    Long getIncome();
    @Value("#{@expenseRepository.getExpense(target.id)}")
    Long getExpense();
}
