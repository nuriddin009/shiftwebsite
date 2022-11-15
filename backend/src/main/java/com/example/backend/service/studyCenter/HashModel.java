package com.example.backend.service.studyCenter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HashModel {
    private String hash;
    private Boolean success;
    private String message;
}
