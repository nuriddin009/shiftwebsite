package com.example.backend.projection;

import java.util.UUID;

public interface UserCertificateProjection {

    UUID getUserId();

    UUID getCertificateId();

    String getFirstName();

    String getLastName();

}
