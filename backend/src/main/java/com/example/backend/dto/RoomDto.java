package com.example.backend.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class RoomDto {
    @NotNull
    private String roomName;



    private List<ClassTimeDto> classTimeTables;
}
