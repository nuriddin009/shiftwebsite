package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
