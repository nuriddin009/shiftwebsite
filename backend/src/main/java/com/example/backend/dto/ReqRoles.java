package com.example.backend.dto;

import com.example.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqRoles {
    private UUID userId;
    private List<Role> roles;
}
