package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomeDto {
    @NotNull
    private Integer amount;

    private String description;

    @NotNull
    private UUID payTypeId;

    @NotNull
    private UUID incomeTypeId;

    @NotNull
    private UUID userId;

    @NotNull
    private Boolean isUsd;

}
