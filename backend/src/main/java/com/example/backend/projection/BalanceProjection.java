package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

public interface BalanceProjection {
    String getType();
    String getId();
    @Value("#{@incomeRepository.getIncome(target.id)}")
    Long getIncome();
    @Value("#{@incomeRepository.getIncomeUsd(target.id)}")
    Long getIncomeUsd();
    @Value("#{@expenseRepository.getExpense(target.id)}")
    Long getExpense();
    @Value("#{@expenseRepository.getExpenseUsd(target.id)}")
    Long getExpenseUsd();
}
