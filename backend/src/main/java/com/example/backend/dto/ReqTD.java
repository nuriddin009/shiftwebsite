package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqTD {
    private   String title;
    private  String description;
    private String title_UZB;
    private String title_RUS;
    private  String description_UZB;
    private  String description_RUS;
}
