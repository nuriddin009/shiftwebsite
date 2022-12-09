package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.studyCenter.IncomeType;
import com.example.backend.entity.studyCenter.PayType;
import com.example.backend.repository.IncomeTypeRepository;
import com.example.backend.repository.PayTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IncomeTypeService {
    private final IncomeTypeRepository incomeTypeRepository;

    @Autowired
    public IncomeTypeService(IncomeTypeRepository incomeTypeRepository) {
        this.incomeTypeRepository = incomeTypeRepository;
    }

    public ApiResponse postIncomeType(String type) {
        incomeTypeRepository.save(new IncomeType(type));
        return new ApiResponse(true,"added");
    }
}
