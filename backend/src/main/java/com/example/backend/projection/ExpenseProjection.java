package com.example.backend.projection;

import java.time.LocalDate;

public interface ExpenseProjection {
    String getTitle();

    String getCreated();

    Integer getAmount();

    String getPayType();

    String getMadeBy();
}
