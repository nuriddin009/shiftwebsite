package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ExpenseDto;
import com.example.backend.entity.studyCenter.Expense;
import com.example.backend.entity.studyCenter.PayType;
import com.example.backend.projection.ExpenseMonthProjection;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.ExpenseRepository;
import com.example.backend.service.UserSession;
import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserSession userSession;

    private final PayTypeRepository payTypeRepository;


    public ApiResponse getExpenses(Integer page, String date) {
        LocalDate startDate = !Objects.equals(date, "") ? LocalDate.parse(date) : null;
        LocalDate endDate = startDate != null ? startDate.plusMonths(1) : null;


        Page<ExpenseMonthProjection> list = expenseRepository.getExpenses(startDate, endDate, PageRequest.of(page - 1, 10));
        return new ApiResponse(true, list);
    }

    @Transactional
    public ApiResponse postExpense(@Valid ExpenseDto expenseDto) {

        PayType payType = payTypeRepository.findById(expenseDto.getPayTypeId()).orElseThrow(() -> new ServiceException("pay type not found"));
        Long income = !expenseDto.getIsUsd()?incomeRepository.getIncome(expenseDto.getPayTypeId()):incomeRepository.getIncomeUsd(expenseDto.getPayTypeId());
        Long exp = !expenseDto.getIsUsd()?expenseRepository.getExpense(expenseDto.getPayTypeId()):expenseRepository.getExpenseUsd(expenseDto.getPayTypeId());
        if(income==null) income=0L;
        if(exp==null) exp=0L;
        if(income - exp < expenseDto.getAmount()) return new ApiResponse(false,String.format("not enough money in %s",payType.getType()));
        Expense expense = new Expense(
                expenseDto.getAmount(),
                expenseDto.getDescription(),
                expenseDto.getTitle(),
                payType
        );
        expense.setUsd(expenseDto.getIsUsd());
        expense.setUser(userSession.getUser());

        expenseRepository.save(expense);
        return new ApiResponse(true, "Expense added");
    }

    public ApiResponse deleteExpense(UUID expenseId) {
        Expense expense = expenseRepository.findById(expenseId).orElseThrow(() -> new ServiceException("not found"));
        expense.setDeleted(true);
        expenseRepository.save(expense);
        return new ApiResponse(true, "expense is deleted");
    }

}
