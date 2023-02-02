package com.example.backend.dto;

import com.example.backend.projection.BalanceProjection;
import com.example.backend.projection.ExpenseProjection;
import lombok.Data;

import java.util.List;

@Data
public class StatisticsRes {
    private List<ExpenseProjection> todayExpense;
    private Integer todayIncome;
    private Integer todayIncomeUsd;
    private  List<BalanceProjection> currentBalance;
}
