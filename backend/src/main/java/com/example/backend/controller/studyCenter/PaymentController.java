package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.PaymentDto;
import com.example.backend.service.studyCenter.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService payTypeService;

    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @PostMapping("{id}")
    public ResponseEntity<ApiResponse> postPayType(@PathVariable Integer id,@RequestBody PaymentDto paymentDto) {
        return ResponseEntity.ok(payTypeService.postPayType(id,paymentDto));
    }

}

