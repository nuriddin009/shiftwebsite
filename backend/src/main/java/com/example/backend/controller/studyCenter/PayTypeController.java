package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IncomeDto;
import com.example.backend.service.studyCenter.IncomeService;
import com.example.backend.service.studyCenter.PayTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/pay_type")
public class PayTypeController {

    private final PayTypeService payTypeService;

    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse> postPayType(@RequestParam String type) {
        return ResponseEntity.ok(payTypeService.postPayType(type));
    }

    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse> getPayType() {
        return ResponseEntity.ok(payTypeService.getPayType());
    }
}
