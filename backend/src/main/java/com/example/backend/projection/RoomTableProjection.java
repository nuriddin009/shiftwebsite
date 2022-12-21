package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface RoomTableProjection {

    String getWeekDay();

    Integer getWeekOrder();


    @Value("#{@timeTableDataRepo.getTimeTableDataBy(target.weekDay)}")
    List<RoomTimeTableDataProjection> getTimeTableDatas();

}
