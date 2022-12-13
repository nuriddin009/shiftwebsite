package com.example.backend.repository;

import com.example.backend.entity.studyCenter.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.UUID;

public interface IncomeRepository extends JpaRepository<Income, UUID> {




    @Query(value = "select *\n" +
            "from income i\n" +
            "         inner join income_type it on i.income_type_id = it.id\n" +
            "         inner join pay_type pt on i.pay_type_id = pt.id\n" +
            "where it.type ilike '%' || :incomeType || '%'\n" +
            "  and pt.type ilike '%' || :payType || '%'\n" +
            "and i.created between :startDate and :endDate", nativeQuery = true)
    Page<Income> findAll(String incomeType, String payType, LocalDate startDate, LocalDate endDate, Pageable pageable);

}
