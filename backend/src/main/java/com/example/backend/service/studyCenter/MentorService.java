package com.example.backend.service.studyCenter;


import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.studyCenter.Mentor;
import com.example.backend.repository.studyCenter.MentorRepo;
import com.example.backend.repository.studyCenter.TimeTableDataRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class MentorService {

    private final MentorRepo mentorRepo;
    private final TimeTableDataRepo timeTableDataRepo;


    public ApiResponse postMentor(String mentorName) {
        Mentor save = mentorRepo.save(new Mentor(mentorName));
        return new ApiResponse(true, save);
    }

    public ApiResponse getMentors() {
        return new ApiResponse(true, mentorRepo.findAll());
    }
}
