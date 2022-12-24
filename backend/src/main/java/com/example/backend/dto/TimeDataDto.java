package com.example.backend.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class TimeDataDto {

    @NotNull
    private UUID id;

    @NotNull
    private UUID mentorId;

    @NotNull
    private UUID groupId;

}
