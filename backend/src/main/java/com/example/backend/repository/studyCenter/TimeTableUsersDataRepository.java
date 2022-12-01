package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.TimeTableUserData;
import com.example.backend.projection.LessonDataProjection;
import com.example.backend.projection.TimeTableDataUserProjection;
import com.example.backend.projection.UserIdProjection;
import com.example.backend.projection.UserLessonProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TimeTableUsersDataRepository extends JpaRepository<TimeTableUserData, Integer> {
    @Query(value = "select cast(t.id as varchar) as id,\n" +
            "       t.lesson_order        as Lessonorder,\n" +
            "       t.has_in_lesson       as Hasinlesson,\n" +
            "       t.homework_mark       as Homeworkmark,\n" +
            "       t.lesson_mark         as Lessonmark,\n" +
            "       t.done,\n" +
            "       t.exam,\n" +
            "       t.isvideoallowed\n" +
            "from time_table_user_data t\n" +
            "where t.time_table_user_id = :id\n" +
            "order by t.lesson_order\n" +
            "limit case when :isMore is true then 20 else 5 end", nativeQuery = true)
    List<LessonDataProjection> getAllByTimeTableUser(Integer id, Boolean isMore);


    @Query(value = "select cast(t.id as varchar) as id,\n" +
            "       t.lesson_order        as Lessonorder,\n" +
            "       t.has_in_lesson       as Hasinlesson,\n" +
            "       t.homework_mark       as Homeworkmark,\n" +
            "       t.lesson_mark         as Lessonmark,\n" +
            "       t.done,\n" +
            "       t.exam,\n" +
            "       t.isvideoallowed\n" +
            "from time_table_user_data t\n" +
            "where t.time_table_user_id = :id\n" +
            "order by t.lesson_order", nativeQuery = true)
    List<LessonDataProjection> getAllByTimeTableUser(Integer id);

    @Query(value = "select ttd\n" +
            "from Time_table t\n" +
            "         join TimeTableUser ttu on t.id = ttu.time_table.id\n" +
            "         join TimeTableUserData ttd on ttu.id = ttd.time_tableUser.id\n" +
            "where t.id = :timeTableId\n" +
            "  and ttd.lesson_Order = :lessonId")
    List<TimeTableUserData> findBylessonIdDone(Integer lessonId, Integer timeTableId);


    @Query(value = "select ttud.id,\n" +
            "       ttud.isvideoallowed,\n" +
            "       ttud.homework_mark,\n" +
            "       ttud.lesson_mark,\n" +
            "       ttud.exam,\n" +
            "       ttud.has_in_lesson,\n" +
            "       ttud.done\n" +
            "from users u\n" +
            "         inner join time_table_user ttu on u.id = ttu.user_id\n" +
            "         inner join time_table_user_data ttud on ttu.id = ttud.time_table_user_id\n" +
            "         inner join time_table tt on ttu.time_table_id = tt.id\n" +
            "where u.id = :userid\n" +
            "  and tt.id = :timetableid\n" +
            "order by ttud.lesson_order", nativeQuery = true)
    List<TimeTableDataUserProjection> getLessonUser(@Param("userid") UUID userid, @Param("timetableid") Integer timetableid);


    @Query(value = "select lh.id,lh.hash,lu.url_video" +
            " from time_table_user_data ttud " +
            "inner join time_table_user ttu on ttu.id = ttud.time_table_user_id " +
            "inner join lesson_hash lh on ttu.user_id = lh.user_id " +
            "inner join lesson_url lu on lh.lesson_url_id = lu.id " +
            "where ttud.id=:id and lh.user_id=:user and ttud.lesson_order=lh.lesson_id  " +
            "group by lh.id, lh.hash, lu.url_video", nativeQuery = true)
    List<UserLessonProjection> getOneData(@Param("id") Integer id, @Param("user") UUID user);


    @Query(value = "select lh.id, lh.hash, lu.url_video\n" +
            "from lesson_hash lh\n" +
            "         inner join lesson_url lu on lu.id = lh.lesson_url_id\n" +
            "where lh.user_id = :userId", nativeQuery = true)
    List<UserLessonProjection> getAllLessonForMentor(@Param("userId") UUID userId);

    @Query(value = "select * from time_table_user_data ttud  where ttud.time_table_user_id=:userId", nativeQuery = true)
    Optional<TimeTableUserData> getTTUD(Integer userId);


    @Transactional
    @Modifying
    @Query(value = "delete from time_table_user_data ttud" +
            " where ttud.time_table_user_id=:id", nativeQuery = true)
    void deleteTTUDBYUser(Integer id);


    @Query(value = "select cast(u.id as varchar) as id, u.first_name as firstName, cast(tt.group_id as varchar) as groupId\n" +
            "from groups g\n" +
            "         inner join time_table tt on g.id = tt.group_id\n" +
            "         inner join time_table_user ttu on tt.id = ttu.time_table_id\n" +
            "         inner join time_table_user_data ttud on ttu.id = ttud.time_table_user_id\n" +
            "         inner join users u on ttu.user_id = u.id\n" +
            "where tt.name = 1\n" +
            "  and tt.is_free is true\n" +
            "group by u.id, g.name,tt.group_id", nativeQuery = true)
    List<UserIdProjection> getAllUserForAddTTUD();


    @Transactional
    @Modifying
    @Query(value = "delete\n" +
            "from time_table_user_data ttud\n" +
            "where ttud.id = :id", nativeQuery = true)
    void deleteErrorTTUD(Integer id);


}
