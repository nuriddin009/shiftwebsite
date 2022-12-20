package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Expense;
import com.example.backend.projection.ExpenseHistoryProjection;
import com.example.backend.projection.ExpenseMonthProjection;
import com.example.backend.projection.ExpenseProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    @Query(value = "select date_trunc('month',e.created) as month  from expense e \n" +
//            "where \n" +
            "group by date_trunc('month',e.created)\n" +
            "order by date_trunc('month',e.created)",
            nativeQuery = true)
    Page<ExpenseMonthProjection> getExpenses(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query(value = "select e.title                            as title,\n" +
            "       e.created                          as created,\n" +
            "       e.amount                           as amount,\n" +
            "       pt.type                            as payType,\n" +
            "       u.first_name || ' ' || u.last_name as madeBy\n" +
            "from expense e\n" +
            "         inner join pay_type pt on e.pay_type_id = pt.id\n" +
            "         inner join users u on e.user_id = u.id " +
            "where e.created > :month and (e.created - interval '1' month < :month)"
            , nativeQuery = true)
    List<ExpenseProjection> findByMonth(LocalDateTime month);

    @Query("select sum(t.amount) from Expense t")
    Long getExpenseSum();
}
