package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Expense;
import com.example.backend.projection.ExpenseHistoryProjection;
import com.example.backend.projection.ExpenseProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    @Query(value = "select cast(em.id as varchar) as id,\n" +
            "       em.year                as year,\n" +
            "       em.month_name          as monthName,\n" +
            "       sum(e.amount)          as amount\n" +
            "from expense_month em\n" +
            "         inner join expense e on em.id = e.expense_month\n" +
            "where case when cast(:startDate as date) is null then true else em.created between :startDate and :endDate end\n" +
            "group by em.month_name, em.month, em.year, em.id\n" +
            "order by em.year, em.month",
            nativeQuery = true)
    Page<ExpenseProjection> getExpenses(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query(value = "select e.title                            as title,\n" +
            "       e.created                          as created,\n" +
            "       e.amount                           as amount,\n" +
            "       pt.type                            as payType,\n" +
            "       u.first_name || ' ' || u.last_name as madeBy\n" +
            "from expense e\n" +
            "         inner join pay_type pt on e.pay_type_id = pt.id\n" +
            "         inner join users u on e.user_id = u.id\n" +
            "where e.expense_month = :id\n" +
            "order by e.created desc", nativeQuery = true)
    List<ExpenseHistoryProjection> getHistory(UUID id);
}
