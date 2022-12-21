package com.example.backend.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ClassTimeDto {

    @NotNull
    private String startTime;

    @NotNull
    private String endTime;

}
