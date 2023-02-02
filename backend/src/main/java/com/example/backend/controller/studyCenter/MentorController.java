package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.service.studyCenter.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final MentorService mentorService;


    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN','ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse> getMentors() {
        return ResponseEntity.ok(mentorService.getMentors());
    }


    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN','ROLE_ADMIN')")
    @GetMapping("/post")
    public ResponseEntity<ApiResponse> postMentor(@RequestParam String mentorName) {
        return ResponseEntity.ok(mentorService.postMentor(mentorName));
    }


}
