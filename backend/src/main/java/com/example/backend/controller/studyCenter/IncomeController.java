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
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService lessonService;

    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse> postIncome(@Valid @RequestBody IncomeDto incomeDto) {
        return ResponseEntity.ok(lessonService.postIncome(incomeDto));
    }

}
