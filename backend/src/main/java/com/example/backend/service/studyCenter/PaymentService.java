package com.example.backend.service.studyCenter;

import com.example.backend.dto.PaymentDto;
import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.Income;
import com.example.backend.entity.studyCenter.PayType;
import com.example.backend.entity.studyCenter.Payment;
import com.example.backend.entity.studyCenter.TimeTableUser;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.IncomeTypeRepository;
import com.example.backend.repository.PayTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.ExpenseRepository;
import com.example.backend.repository.studyCenter.PaymentRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PayTypeRepository payTypeRepository;
    private final UserRepository userRepository;
    private final IncomeTypeRepository incomeTypeRepository;
    private final IncomeRepository incomeRepository;
    private final TimeTableUsersRepository timeTableUsersRepository;
    private final ExpenseRepository expenseRepository;

    public ApiResponse postPayType(Integer id, PaymentDto paymentDto) {
        TimeTableUser timeTableUser = timeTableUsersRepository.getReferenceById(id);
        User user = timeTableUser.getUser();
        if (!paymentDto.isNewPayment() && user.getBalance() < paymentDto.getAmount())
            throw new ServiceException(String.format("%s has not this amount of money", user.getFirstName()));
        if (!paymentDto.isNewPayment()) {
            user.setBalance(user.getBalance() - paymentDto.getAmount());
            userRepository.save(user);
        } else {
            PayType payType = payTypeRepository.getReferenceById(paymentDto.getPayType());
            Income income = new Income(paymentDto.getAmount(), paymentDto.getDesc(), payType, incomeTypeRepository.findByType("Student"), user);
            incomeRepository.save(income);
        }
        Payment payment = new Payment();
        payment.setAmount(paymentDto.getAmount());
        payment.setTimeTableUser(timeTableUser);
        paymentRepository.save(payment);
        timeTableUser.setPaid(timeTableUser.getPaid() + paymentDto.getAmount());
        timeTableUsersRepository.save(timeTableUser);
        return new ApiResponse(true, "saved");
    }

    public ApiResponse getBalance() {
        Long incomeSum = incomeRepository.getIncomeSum(false);
        Long incomeUsdSum = incomeRepository.getIncomeSum(true);
        Long expenseSum = expenseRepository.getExpenseSum(false);
        Long expenseSumUsd = expenseRepository.getExpenseSum(true);
        BalanceRes balanceRes = new BalanceRes(incomeSum, expenseSum, incomeUsdSum, expenseSumUsd);
        return new ApiResponse(true, balanceRes);
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class BalanceRes {
    private Long income;
    private Long expense;
    private Long incomeUsd;
    private Long expenseUsd;
}