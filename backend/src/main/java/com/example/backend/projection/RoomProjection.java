package com.example.backend.projection;

import java.time.LocalDateTime;
import java.util.UUID;

public interface RoomProjection {

    UUID getId();

    String getRoomName();

    Integer getTimesCount();

    LocalDateTime getRoomCreated();
}
