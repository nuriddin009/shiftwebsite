package com.example.backend.repository.studyCenter;

import com.example.backend.entity.Certificate;
import com.example.backend.projection.UserCertificateProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {


    @Query(value = "select cast(u.id as varchar) as userId,\n" +
            "       cast(c.id as varchar) as certificateId,\n" +
            "       u.first_name          as firstName,\n" +
            "       u.last_name           as lastName\n" +
            "from users u\n" +
            "         inner join certificate c on u.id = c.user_id\n" +
            "where concat(u.first_name || ' '|| u.last_name) ilike '%' || :search || '%'",
            countQuery = "select cast(u.id as varchar) as userId,\n" +
                    "       cast(c.id as varchar) as certificateId,\n" +
                    "       u.first_name          as firstName,\n" +
                    "       u.last_name           as lastName\n" +
                    "from users u\n" +
                    "         inner join certificate c on u.id = c.user_id\n" +
                    "where concat(u.first_name || ' '|| u.last_name) ilike '%' || :search || '%'", nativeQuery = true)
    Page<UserCertificateProjection> getAllUsersCertificate(Pageable pageable, String search);

    void deleteAllByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query(value = "delete from Certificate c where c.user.id=:userId")
    void deleteUserCertificate(UUID userId);


}

