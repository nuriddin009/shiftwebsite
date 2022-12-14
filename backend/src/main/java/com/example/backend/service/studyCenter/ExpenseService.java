package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ExpenseDto;
import com.example.backend.entity.studyCenter.Expense;
import com.example.backend.entity.studyCenter.ExpenseMonth;
import com.example.backend.projection.ExpenseMonthProjection;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.ExpenseMonthRepository;
import com.example.backend.repository.studyCenter.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final PayTypeRepository payTypeRepository;
    private final ExpenseMonthRepository expenseMonthRepository;


    public ApiResponse getExpenses(Integer page, String date) {
        LocalDate startDate = !Objects.equals(date, "") ? LocalDate.parse(date) : null;
        LocalDate endDate = startDate != null ? startDate.plusMonths(1) : null;


        Page<ExpenseMonthProjection> list = expenseRepository.getExpenses(startDate, endDate, PageRequest.of(page - 1, 10));
        return new ApiResponse(true, list);
    }

    public ApiResponse postExpense(@Valid ExpenseDto expenseDto) {
        LocalDateTime date = LocalDateTime.now();
        int monthValue = date.getMonthValue();
        int year = date.getYear();

        ExpenseMonth expenseMonth = expenseMonthRepository.findByMonthAndYear(monthValue, year)
                .orElseGet(() -> expenseMonthRepository.save(new ExpenseMonth(monthValue, date.getMonth().toString(), year)));

        Expense expense = new Expense(
                expenseDto.getAmount(),
                expenseDto.getDescription(),
                expenseDto.getTitle(),
                payTypeRepository.findById(expenseDto.getPayTypeId()).orElseThrow(() -> new ServiceException("pay type not found")),
                expenseMonth
        );

        expenseRepository.save(expense);
        return new ApiResponse(true, "Expense added");
    }
}
