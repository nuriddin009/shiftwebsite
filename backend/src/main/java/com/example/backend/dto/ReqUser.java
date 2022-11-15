package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqUser {
    private UUID id;
    private String username;
    private String password;
    private String firstName;
    private  String lastName;
    private String phoneNumber;
    private String address;
    private Integer age;
    private Boolean activ;
    private UUID attachment_id;
    private String fatherPhoneNumber;

}
