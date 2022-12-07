package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IncomeDto;
import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.Income;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.IncomeTypeRepository;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final PayTypeRepository payTypeRepository;
    private final IncomeTypeRepository incomeTypeRepository;
    private final UserRepository userRepository;

    @Autowired
    public IncomeService(IncomeRepository incomeRepository, PayTypeRepository payTypeRepository, IncomeTypeRepository incomeTypeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.payTypeRepository = payTypeRepository;
        this.incomeTypeRepository = incomeTypeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ApiResponse postIncome(IncomeDto incomeDto) {
        User user = userRepository.findById(incomeDto.getUserId()).orElseThrow(() -> new ServiceException("User is not found"));
        user.setBalance(user.getBalance() + incomeDto.getAmount());
        Income income = new Income(
                incomeDto.getAmount(),
                incomeDto.getDescription(),
                payTypeRepository.findById(incomeDto.getPayTypeId()).orElseThrow(() -> new ServiceException("pay type not found")),
                incomeTypeRepository.findById(incomeDto.getIncomeTypeId()).orElseThrow(() -> new ServiceException("income type not found")),
                user
        );
        incomeRepository.save(income);
        userRepository.save(user);
        return new ApiResponse(true, "Income is added");
    }
}
