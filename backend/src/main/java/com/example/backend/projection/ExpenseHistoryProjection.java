package com.example.backend.projection;

import java.math.BigDecimal;

public interface ExpenseHistoryProjection {

    String getTitle();

    String getDate();

    BigDecimal getAmount();

    String getPayType();

    String getMadeBy();
}
