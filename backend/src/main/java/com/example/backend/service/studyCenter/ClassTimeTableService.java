package com.example.backend.service.studyCenter;


import com.example.backend.dto.ApiResponse;
import com.example.backend.repository.studyCenter.ClassTimeTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ClassTimeTableService {


    private final ClassTimeTableRepository classTimeTableRepository;


    public ApiResponse getAllClassTimeTable() {
        return null;
    }

    public ApiResponse addRoom() {
        return null;
    }
}
