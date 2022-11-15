package com.example.backend.projection;


import com.example.backend.entity.Role;

import java.util.List;
import java.util.UUID;

public interface UserProjection {

    UUID getId();

    String getUsername();

    String getAddress();

    String getPhoneNumber();

    Integer getAge();

    String getFirstName();

    String getLastName();

    Boolean getActiv();

    String getFatherPhoneNumber();

    List<Role> getRoles();

    AttachmentidProjection getAttachment();
}
