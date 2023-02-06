package com.example.backend.repository;

import com.example.backend.entity.studyCenter.Income;
import com.example.backend.projection.BalanceProjection;
import com.example.backend.projection.ExpenseProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IncomeRepository extends JpaRepository<Income, UUID> {


    @Query(value = "select *\n" +
            "from income i\n" +
            "         inner join income_type it on i.income_type_id = it.id\n" +
            "         inner join pay_type pt on i.pay_type_id = pt.id\n" +
            "where it.type ilike '%' || :incomeType || '%'\n" +
            "  and pt.type ilike '%' || :payType || '%'\n" +
            " and( i.deleted is null or i.deleted is false) " +
            "and case when cast(:startDate  as date) is null  then true else i.created between :startDate and :endDate end " +
            "and ((:today is true and cast(i.created as date) = cast(now() as date) or :today is false)) order by i.created desc",
            countQuery = "select count(i.id)\n" +
                    "from income i\n" +
                    "         inner join income_type it on i.income_type_id = it.id\n" +
                    "         inner join pay_type pt on i.pay_type_id = pt.id\n" +
                    "where it.type ilike '%' || :incomeType || '%'\n" +
                    "  and pt.type ilike '%' || :payType || '%'\n" +
                    " and( i.deleted is null or i.deleted is false) " +
                    "and case when cast(:startDate  as date) is null  then true else i.created between :startDate and :endDate end " +
                    "and ((:today is true and cast(i.created as date) = cast(now() as date) or :today is false))", nativeQuery = true)
    Page<Income> findAll(String incomeType, String payType, LocalDate startDate, LocalDate endDate, Boolean today, Pageable pageable);

    @Query("select sum(t.amount) from Income t where (t.deleted is null or t.deleted is false) and t.usd=:usd")
    Long getIncomeSum(Boolean usd);


    @Query("select sum(t.amount)" +
            " from Income t where cast(t.created as date) = cast(:now as date) and (t.deleted is null or t.deleted is false) and t.usd is false")
    Integer findTodayIncome(LocalDate now);

    @Query("select t from PayType t")
    List<BalanceProjection> getCurrentBalance();

    @Query(
            " select sum(t.amount) from Income t where t.payType.id=:uuid and (t.deleted is null or t.deleted is false) and t.usd is false"
    )
    Long getIncome(UUID uuid);

    @Query(
            " select sum(t.amount) from Income t where t.payType.id=:payTypeId and (t.deleted is null or t.deleted is false) and t.usd is true"
    )
    Long getIncomeUsd(UUID payTypeId);

    @Query("select sum(t.amount)" +
            " from Income t where cast(t.created as date) = cast(:now as date) and (t.deleted is null or t.deleted is false) and t.usd is true ")
    Integer findTodayIncomeUsd(LocalDate now);

    @Transactional
    @Modifying
    @Query(value = "delete from Income i where i.user.id=:userId")
    void deleteIncomeBy(UUID userId);
}
