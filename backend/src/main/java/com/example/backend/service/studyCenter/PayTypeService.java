package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.studyCenter.PayType;
import com.example.backend.repository.PayTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayTypeService {
    private final PayTypeRepository payTypeRepository;

    @Autowired
    public PayTypeService(PayTypeRepository payTypeRepository) {
        this.payTypeRepository = payTypeRepository;
    }

    public ApiResponse postPayType(String type) {
        PayType save = payTypeRepository.save(new PayType(type));
        return new ApiResponse(true,save);
    }

    public ApiResponse getPayType() {
        List<PayType> payTypes = payTypeRepository.findAll();
        return new ApiResponse(true,payTypes);
    }
}
