package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseProjection {

    String getYear();

    String getMonth();

    BigDecimal getAmount();

//    @Value("#{@expenseRepository.getHistory(target.year,target.month)}")
//    List<ExpenseHistoryProjection> getHistory();
}
