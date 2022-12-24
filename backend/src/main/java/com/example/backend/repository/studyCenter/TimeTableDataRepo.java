package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.TimeTableData;
import com.example.backend.projection.RoomTimeTableDataProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.UUID;
import java.util.List;


@Repository
public interface TimeTableDataRepo extends JpaRepository<TimeTableData, UUID> {


    @Query(value = "select cast(ttd.id as varchar) as id\n" +
            "from time_table_data ttd\n" +
            "         inner join class_time_table ctt on ctt.id = ttd.class_time_table_id\n" +
            "         inner join rooms r on r.id = ctt.room_id\n" +
            "where ttd.weekday = :weekDay\n" +
            "order by r.created, ctt.created, ttd.created", nativeQuery = true)
    List<RoomTimeTableDataProjection> getTimeTableDataBy(String weekDay);

    @Transactional
    @Modifying
    @Query(value = "delete\n" +
            "from time_table_data ttd\n" +
            "where ttd.class_time_table_id = :id", nativeQuery = true)
    void deleteData(UUID id);


    @Query(value = "select t from TimeTableData t where t.id=:id")
    TimeTableData getTimeTableDataPro(UUID id);

}
