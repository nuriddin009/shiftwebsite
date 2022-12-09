package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.service.studyCenter.IncomeTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/income_type")
public class IncomeTypeController {

    private final IncomeTypeService incomeService;

    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse> postIncomeType(@RequestParam String type) {
        return ResponseEntity.ok(incomeService.postIncomeType(type));
    }
}
