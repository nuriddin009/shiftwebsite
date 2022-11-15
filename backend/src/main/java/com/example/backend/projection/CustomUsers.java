package com.example.backend.projection;

import com.example.backend.entity.Role;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.UUID;

public interface CustomUsers {
    UUID getId();

    String getUsername();

    String getAddress();

    String getPhoneNumber();

    Integer getAge();

    String getFirstName();

    String getLastName();

    Boolean getActiv();

    String getFatherPhoneNumber();

    @Value("#{@roleRepository.getUserRoles(target.id)}")
    List<RoleProjection> getRoles();
}
