package com.example.backend.service.studyCenter;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoomstreamRes {
    @JsonProperty("Hash")
    private String Hash;

    @JsonProperty("Email")
    private String Email;

    @JsonProperty("Period")
    private Integer Period;

    @JsonProperty("Recovery")
    private Integer Recovery;

    @JsonProperty("DatePurchase")
    private String DatePurchase;

    @JsonProperty("AccessExpirationDate")
    private String AccessExpirationDate;

    @JsonProperty("Message")
    private String Message;

    @JsonProperty("Status")
    private String Status;

    @JsonProperty("Version")
    private String Version;
}