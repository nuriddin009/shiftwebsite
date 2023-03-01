package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import javax.transaction.Transactional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Modifying
    @Transactional
    void deleteAllByTimeTableUserId(Integer id);

}
