package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Time_table;

import com.example.backend.projection.OneUserTimeTable;
import com.example.backend.projection.TimeTableDataUserProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TimeTableRepository extends JpaRepository<Time_table, Integer> {
        List<Time_table> findAllByGroupIdOrderByName(UUID id);
        @Query(value = "select tb.id as id," +
                "tb.name as name from users u " +
                "inner join time_table_user ttu on u.id = ttu.user_id" +
                " inner join time_table tb on ttu.time_table_id = tb.id " +
                "inner join groups g on tb.group_id = g.id" +
                " where u.id=:userid and g.id=:groupid",nativeQuery = true)
        List<OneUserTimeTable> getTimetable(@Param("userid") UUID userid,@Param("groupid") UUID groupid);

        @Query(value = "select ttud.id,ttud.isvideoallowed," +
                "ttud.homework_mark,ttud.lesson_mark," +
                "ttud.exam,ttud.has_in_lesson,ttud.done" +
                " from time_table_user_data ttud " +
                "inner join time_table_user ttu on ttud.time_table_user_id = ttu.id " +
                "inner join time_table tt on tt.id = ttu.time_table_id " +
                "inner join lesson l on ttud.lesson_order = l.lesson_order " +
                "where ttu.user_id=:userid and tt.is_free and l.isactive and ttu.gotogroup=0" +
                " order by  ttud.lesson_order ",nativeQuery = true)
        List<TimeTableDataUserProjection> getuserlesson(@Param("userid") UUID userid);
}
