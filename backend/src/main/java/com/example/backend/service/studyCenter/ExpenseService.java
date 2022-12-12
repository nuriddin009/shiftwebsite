package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ExpenseDto;
import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.Expense;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final PayTypeRepository payTypeRepository;


    public ApiResponse getExpenses() {
        List<Expense> list = expenseRepository.findAll();
        return new ApiResponse(true, list);
    }

    public ApiResponse postExpense(@Valid ExpenseDto expenseDto) {
        Expense expense = new Expense(
                expenseDto.getAmount(),
                expenseDto.getDescription(),
                expenseDto.getTitle(),
                payTypeRepository.findById(expenseDto.getPayTypeId()).orElseThrow(() -> new ServiceException("pay type not found"))
        );
        expenseRepository.save(expense);
        return new ApiResponse(true, "Expense added");
    }
}
