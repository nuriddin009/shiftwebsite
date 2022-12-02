package com.example.backend.dto;

import com.example.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    private String token;
    private String refreshToken;
    private List<Role> roles;
    private String tokenType = "Bearer";
    private String username;
    private Boolean success;
    private UUID attachmentid;

    public JwtAuthResponse(Boolean success, String token, List<Role> roles, String username,String refreshToken) {
        this.success = success;
        this.token = token;
        this.roles = roles;
        this.username = username;
        this.refreshToken = refreshToken;
    }

    public JwtAuthResponse(List<Role> roles, String username, UUID attachmentid) {
        this.roles = roles;
        this.username = username;
        this.attachmentid = attachmentid;
    }

    public JwtAuthResponse(Boolean success, String username) {
        this.success = success;
        this.username = username;
    }

    public JwtAuthResponse(String accessToken, String refreshToken) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
    }
}
