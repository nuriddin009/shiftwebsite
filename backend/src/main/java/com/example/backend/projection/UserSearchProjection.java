package com.example.backend.projection;


import com.example.backend.entity.Role;

import java.util.List;
import java.util.UUID;

public interface UserSearchProjection {

    UUID getId();

    String getUsername();

    String getAddress();

    String getPhoneNumber();

    Integer getAge();

    String getFirstName();

    String getLastName();

    Boolean getActiv();

    String getFatherPhoneNumber();
    Integer getBalance();

    List<Role> getRoles();
}
