package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.TimeTableData;
import com.example.backend.projection.RoomTimeTableDataProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;


@Repository
public interface TimeTableDataRepo extends JpaRepository<TimeTableData, UUID> {


    @Query(value = "select cast(ttd.id as varchar) as id, ttd.group_name as groupName, ttd.mentor as teacher\n" +
            "from time_table_data ttd\n" +
            "where ttd.weekday = :weekDay\n" +
            "order by ttd.created", nativeQuery = true)
    List<RoomTimeTableDataProjection> getTimeTableDataBy(String weekDay);

}
