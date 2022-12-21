package com.example.backend.projection;

import java.util.UUID;

public interface ClassTimeTableProjection {

    UUID getId();

    String getStartTime();

    String getEndTime();

}
