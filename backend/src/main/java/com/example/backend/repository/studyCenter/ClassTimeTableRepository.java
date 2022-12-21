package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.ClassTimeTable;
import com.example.backend.projection.ClassTimeTableProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import java.util.UUID;

public interface ClassTimeTableRepository extends JpaRepository<ClassTimeTable, UUID> {

    @Query(value = "select cast(ctt.id as varchar) as id, ctt.start_time as startTime, ctt.end_time as endTime\n" +
            "from class_time_table ctt\n" +
            "         inner join rooms r on r.id = ctt.room_id\n" +
            "order by r.created, ctt.created", nativeQuery = true)
    List<ClassTimeTableProjection> getClassTimeTableBy();

}
