package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.repository.studyCenter.ClassTimeTableRepository;
import com.example.backend.repository.studyCenter.RoomRepository;
import com.example.backend.service.studyCenter.ClassTimeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/classTimeTable")
public class ClassTimeTableController {


    private final ClassTimeTableService classTimeTableService;


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping
    public HttpEntity<ApiResponse> getClassTimeTables(){
        return ResponseEntity.ok(classTimeTableService.getAllClassTimeTable());
    }

    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping("/addRoom")
    public HttpEntity<ApiResponse> addRoom(){
        return ResponseEntity.ok(classTimeTableService.addRoom());
    }



}
