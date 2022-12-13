package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IncomeDto;
import com.example.backend.dto.ReqLessonUrl;
import com.example.backend.entity.studyCenter.Lesson;
import com.example.backend.entity.studyCenter.Lesson_url;
import com.example.backend.service.studyCenter.IncomeService;
import com.example.backend.service.studyCenter.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService incomeService;


    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse> postIncome(@Valid @RequestBody IncomeDto incomeDto) {
        return ResponseEntity.ok(incomeService.postIncome(incomeDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse> getIncomes(
            @RequestParam(defaultValue = "") String incomeType,
            @RequestParam(defaultValue = "") String payType,
            @RequestParam Boolean today,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(required = false,defaultValue = "") String time
    ) {
        System.out.println(time);
        return ResponseEntity.ok(
                incomeService.getIncomes(incomeType, payType, today, page, time));
    }


}
