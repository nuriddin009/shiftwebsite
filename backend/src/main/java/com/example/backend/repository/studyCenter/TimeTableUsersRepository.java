package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Time_table_user;
import com.example.backend.entity.telegramBot.Parent;
import com.example.backend.projection.BotConnectOrProjection;
import com.example.backend.projection.CustomTimeTableUser;
import com.example.backend.projection.TimeTableUserDemoProjection;
import com.example.backend.projection.TimeTableUserProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TimeTableUsersRepository extends JpaRepository<Time_table_user, Integer> {


    @Query(value =
            "select ttu.id,\n" +
                    "       tt.name               as timatablename,\n" +
                    "       ttu.deletedate,\n" +
                    "       tt.name,\n" +
                    "       tt.is_more            as isMore,\n" +
                    "       ttu.gotogroup         as gotogroup,\n" +
                    "       ttu.whytogroup,\n" +
                    "       ttu.price,\n" +
                    "       cast(u.id as varchar) as userid,\n" +
                    "       u.first_name          as firstname,\n" +
                    "       u.last_name           as lastname,\n" +
                    "       u.phone_number        as phone,\n" +
                    "       u.father_phone_number as fatherPhoneNumber,\n" +
                    "       tt.is_free\n" +
                    "from groups\n" +
                    "         inner join\n" +
                    "     time_table tt on groups.id = tt.group_id\n" +
                    "         inner join\n" +
                    "     time_table_user ttu on tt.id = ttu.time_table_id\n" +
                    "         inner join\n" +
                    "     users u on ttu.user_id = u.id\n" +
                    "where tt.id = :id\n" +
                    "order by ttu.gotogroup, ttu.id", nativeQuery = true)
    List<TimeTableUserProjection> getTimeTableUsersByTimeTableId(Integer id);


    @Query(value = "select p.chat_id      as chatId,\n" +
            "       p.phone_number as phoneNumber\n" +
            "from parent p\n" +
            "         inner join users u on p.phone_number = u.father_phone_number\n" +
            "where u.id = :userId", nativeQuery = true)
    List<BotConnectOrProjection> getParentIdFor(UUID userId);
 

    @Query(value = "select ttu.id,\n" +
            "       tt.name               as timatablename,\n" +
            "       ttu.deletedate,\n" +
            "       tt.name,\n" +
            "       tt.is_more            as isMore,\n" +
            "       ttu.gotogroup         as gotogroup,\n" +
            "       ttu.whytogroup,\n" +
            "       ttu.price,\n" +
            "       cast(u.id as varchar) as userid,\n" +
            "       u.first_name          as firstname,\n" +
            "       u.last_name           as lastname,\n" +
            "       u.phone_number        as phone,\n" +
            "       tt.is_free\n" +
            "from groups\n" +
            "         inner join\n" +
            "     time_table tt on groups.id = tt.group_id\n" +
            "         inner join\n" +
            "     time_table_user ttu on tt.id = ttu.time_table_id\n" +
            "         inner join\n" +
            "     users u on ttu.user_id = u.id\n" +
            "where tt.id = :id\n" +
            "order by ttu.gotogroup, ttu.id;", nativeQuery = true)
    List<TimeTableUserDemoProjection> getTimeTableUsersByTimeTableId1(Integer id);

    @Query(value = "select ttu.id,\n" +
            "                     tt.name as timatablename,\n" +
            "                     ttu.gotogroup         as gotogroup,\n" +
            "                     groups.name        as groupname ,\n" +
            "                     ttu.whytogroup,\n" +
            "                     ttu.price,\n" +
            "                     cast(u.id as varchar) as userid,\n" +
            "                     u.first_name          as firstname,\n" +
            "                     u.last_name           as lastname,\n" +
            "                     u.phone_number        as phone,\n" +
            "                     ttu.deletedate \n" +
            "              from groups\n" +
            "                       inner join\n" +
            "                   time_table tt on groups.id = tt.group_id\n" +
            "                       inner join\n" +
            "                   time_table_user ttu on tt.id = ttu.time_table_id\n" +
            "                       inner join\n" +
            "                   users u on ttu.user_id = u.id\n" +
            "              where ((coalesce(:startdate, null) is null and coalesce(:enddate, null) is null ) or ( (coalesce(:startdate , null) is not null and coalesce(:enddate, null) is not null and  ttu.deletedate between :startdate and :enddate)) or ( (coalesce(:startdate , null) is null and coalesce(:enddate, null) is not null and ttu.deletedate<=:enddate)) or ((coalesce(:startdate , null) is not null and coalesce(:enddate, null) is null and  tt.start_date>=:startdate))) and concat(u.first_name,u.last_name) ilike '%'||:fullname||'%' and ttu.gotogroup>=1\n" +
            "              order by ttu.gotogroup asc, ttu.id desc", nativeQuery = true
            , countQuery = "select ttu.id,\n" +
            "                     tt.name as timatablename,\n" +
            "                     ttu.gotogroup         as gotogroup,\n" +
            "                     groups.name        as groupname ,\n" +
            "                     ttu.whytogroup,\n" +
            "                     ttu.price,\n" +
            "                     cast(u.id as varchar) as userid,\n" +
            "                     u.first_name          as firstname,\n" +
            "                     u.last_name           as lastname,\n" +
            "                     u.phone_number        as phone,\n" +
            "                     ttu.deletedate \n" +
            "              from groups\n" +
            "                       inner join\n" +
            "                   time_table tt on groups.id = tt.group_id\n" +
            "                       inner join\n" +
            "                   time_table_user ttu on tt.id = ttu.time_table_id\n" +
            "                       inner join\n" +
            "                   users u on ttu.user_id = u.id\n" +
            "              where ((coalesce(:startdate, null) is null and coalesce(:enddate, null) is null ) or ( (coalesce(:startdate , null) is not null and coalesce(:enddate, null) is not null and  ttu.deletedate between :startdate and :enddate)) or ( (coalesce(:startdate , null) is null and coalesce(:enddate, null) is not null and ttu.deletedate<=:enddate)) or ((coalesce(:startdate , null) is not null and coalesce(:enddate, null) is null and  tt.start_date>=:startdate))) and concat(u.first_name,u.last_name) ilike '%'||:fullname||'%' and ttu.gotogroup>=1\n" +
            "              order by ttu.gotogroup asc, ttu.id desc")
    Page<TimeTableUserProjection> getDeleteUserTimetable(LocalDate startdate, LocalDate enddate, String fullname, Pageable pageable);

    @Query(value = "select ttu.id as id, ttu.time_table_id as timeTableId\n" +
            "from time_table_user ttu\n" +
            "         inner join time_table tt on tt.id = ttu.time_table_id\n" +
            "where ttu.user_id = :userId\n" +
            "  and tt.group_id = :groupId", nativeQuery = true)
    List<CustomTimeTableUser> findByUserId(UUID userId, UUID groupId);

    List<Time_table_user> findByUserId(UUID userId);

//
//    @Query(value = "select p.id as id, amount, description, title,p.date, u.name,p.pay_type as payType from payment p  join users u on u.id = p.user_id where u.name ilike %:user% and p.pay_type like :payType% and concat(p.title,p.description) ilike %:text%\n" +
//            "                                                and ((coalesce(:start, null) is null and coalesce(:end, null) is null )\n" +
//            "                                                         or ( (coalesce(:start , null) is not null and coalesce(:end, null) is not null and  p.date between :start and :end))) " +
//            "                               and p.amount between :min and :max",
//            countQuery = "select count (*) from payment", nativeQuery = true)
//    Page<ResPayment> findWithCustomValues(Pageable pageable, String text, LocalDate start, LocalDate end, Integer min, Integer max, String payType, String user);


    @Modifying
    @Transactional
    @Query(value = "delete\n" +
            "from time_table_user ttu\n" +
            "where ttu.user_id = :userId", nativeQuery = true)
    void deleteByUserId(UUID userId);


}
