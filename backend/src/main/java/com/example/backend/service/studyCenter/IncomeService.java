package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IncomeDto;
import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.Income;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.IncomeTypeRepository;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import lombok.SneakyThrows;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

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

    @SneakyThrows
    public ApiResponse getIncomes(String incomeType, String payType, Boolean today, Integer page, String date) {
        LocalDate startDate = !Objects.equals(date, "") ? LocalDate.parse(date) : null;
        LocalDate endDate = startDate != null ? startDate.plusMonths(1) : null;

        Page<Income> list = incomeRepository.findAll(incomeType, payType, startDate, endDate, today, PageRequest.of(page - 1, 10));
        return new ApiResponse(true, list);
    }

    @Transactional
    public ApiResponse deleteIncome(UUID incomeId) {
        Income income = incomeRepository.findById(incomeId).orElseThrow(() -> new ServiceException("income not found"));
        User user = income.getUser();
        user.setBalance(user.getBalance()-income.getAmount());
        userRepository.save(user);
        incomeRepository.save(income);
        return new ApiResponse(true,"income is deleted");
    }
}
