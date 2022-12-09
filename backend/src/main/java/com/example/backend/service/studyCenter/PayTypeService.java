package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.studyCenter.PayType;
import com.example.backend.repository.PayTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PayTypeService {
    private final PayTypeRepository payTypeRepository;

    @Autowired
    public PayTypeService(PayTypeRepository payTypeRepository) {
        this.payTypeRepository = payTypeRepository;
    }

    public ApiResponse postPayType(String type) {
        payTypeRepository.save(new PayType(type));
        return new ApiResponse(true,"added");
    }
}
