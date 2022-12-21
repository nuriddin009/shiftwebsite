package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Room;
import com.example.backend.projection.RoomProjection;
import com.example.backend.projection.RoomTableProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {


    @Query(value = "select cast(r.id as varchar) as id, r.room_name as roomName, count(ctt.id) as timesCount, r.created as roomCreated\n" +
            "from rooms r\n" +
            "         inner join class_time_table ctt on r.id = ctt.room_id\n" +
            "group by r.room_name, r.created, r.id\n" +
            "order by r.created", nativeQuery = true)
    List<RoomProjection> getRoomsBy();


    @Query(value = "select ttd.weekday as weekDay, ttd.week_order as weekOrder\n" +
            "from time_table_data ttd\n" +
            "group by ttd.weekday, ttd.week_order\n" +
            "order by ttd.week_order", nativeQuery = true)
    List<RoomTableProjection> getRoomsTables();


}
