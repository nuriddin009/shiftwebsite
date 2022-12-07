package com.example.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoomDto {
    private String roomName;

    private List<String> classTimeTables;

}
