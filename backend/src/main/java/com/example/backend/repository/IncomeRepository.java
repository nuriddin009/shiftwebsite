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
            "and case when cast(:startDate  as date) is null  then true else i.created between :startDate and :endDate end " +
            "and ((:today is true and cast(i.created as date) = cast(now() as date) or :today is false))", nativeQuery = true)
    Page<Income> findAll(String incomeType, String payType, LocalDate startDate, LocalDate endDate, Boolean today, Pageable pageable);

}
