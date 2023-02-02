package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Expense;
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

    @Query(value = "select sum(CASE WHEN usd is false THEN amount ELSE 0 END) as amount,sum(CASE WHEN usd is true THEN amount ELSE 0 END) as amountUsd, date_trunc('month',e.created) as month  from expense e \n" +
            "where  case when cast(:startDate  as date) is null  then true else e.created between :startDate and :endDate end and (e.deleted is null or e.deleted is false)\n" +
            "group by date_trunc('month',e.created), e.usd\n" +
            "order by date_trunc('month',e.created)",
            nativeQuery = true)
    Page<ExpenseMonthProjection> getExpenses(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query(value = "select e.title                            as title,\n" +
            "       e.created                          as created,\n" +
            "       cast(e.id as varchar)              as id,\n" +
            "       e.amount                           as amount,\n" +
            "       e.usd                              as usd,\n" +
            "       pt.type                            as payType,\n" +
            "       u.first_name || ' ' || u.last_name as madeBy\n" +
            "from expense e\n" +
            "         inner join pay_type pt on e.pay_type_id = pt.id\n" +
            "         inner join users u on e.user_id = u.id " +
            "where e.created > :month and (e.created - interval '1' month < :month) and (e.deleted is null or e.deleted is false)"
            , nativeQuery = true)
    List<ExpenseProjection> findByMonth(LocalDateTime month);

    @Query("select sum(t.amount) from Expense t where (t.deleted is null or t.deleted is false) and t.usd=:usd")
    Long getExpenseSum(Boolean usd);

    @Query("select t.title as title,t.id as id,t.amount as amount, t.payType.type as payType, t.usd as usd " +
            " from Expense t where cast(t.created as date) = cast(:now as date) and (t.deleted is null or t.deleted is false)")
    List<ExpenseProjection> findTodayExpense(LocalDate now);

    @Query(
            " select sum(t.amount) from Expense t where t.payType.id=:uuid and (t.deleted is null or t.deleted is false) and t.usd is false"
    )
    Long getExpense(UUID uuid);

    @Query(
            " select sum(t.amount) from Expense t where t.payType.id=:payTypeId and (t.deleted is null or t.deleted is false) and t.usd is true"
    )
    Long getExpenseUsd(UUID payTypeId);
}
