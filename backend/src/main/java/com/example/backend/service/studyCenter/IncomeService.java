package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IncomeDto;
import com.example.backend.dto.StatisticsRes;
import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.Income;
import com.example.backend.projection.BalanceProjection;
import com.example.backend.projection.ExpenseProjection;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.IncomeTypeRepository;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.ExpenseRepository;
import lombok.SneakyThrows;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final PayTypeRepository payTypeRepository;
    private final IncomeTypeRepository incomeTypeRepository;
    private final UserRepository userRepository;

    @Autowired
    public IncomeService(IncomeRepository incomeRepository, ExpenseRepository expenseRepository, PayTypeRepository payTypeRepository, IncomeTypeRepository incomeTypeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
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
        income.setUsd(incomeDto.getIsUsd());
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
        income.setDeleted(true);
        incomeRepository.save(income);
        return new ApiResponse(true,"income is deleted");
    }


    public ApiResponse getStatistics() {
        List<ExpenseProjection> todayExpense = expenseRepository.findTodayExpense(LocalDate.now());
        Integer todayIncome = incomeRepository.findTodayIncome(LocalDate.now());
        Integer todayIncomeUsd = incomeRepository.findTodayIncomeUsd(LocalDate.now());
        List<BalanceProjection> currentBalance = incomeRepository.getCurrentBalance();
        StatisticsRes statisticsRes= new StatisticsRes();
        statisticsRes.setTodayExpense(todayExpense);
        statisticsRes.setTodayIncome(todayIncome==null?0:todayIncome);
        statisticsRes.setTodayIncomeUsd(todayIncomeUsd==null?0:todayIncomeUsd);
        statisticsRes.setCurrentBalance(currentBalance);
        return new ApiResponse(true,statisticsRes);
    }

}
