package com.example.backend.projection;

import java.util.UUID;

public interface UserIdProjection {

    UUID getId();

    UUID getGroupId();

    String getFirstName();
}
