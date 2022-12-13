package com.example.backend.projection;

public interface ExpenseHistoryProjection {

    String getTitle();

    String getCreated();

    Integer getAmount();

    String getPayType();

    String getMadeBy();
}
