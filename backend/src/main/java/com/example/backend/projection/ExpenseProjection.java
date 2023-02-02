package com.example.backend.projection;

import java.time.LocalDate;
import java.util.UUID;

public interface ExpenseProjection {
    UUID getId();
    String getTitle();

    String getCreated();

    Integer getAmount();

    String getPayType();

    String getMadeBy();
    Boolean getUsd();
}
