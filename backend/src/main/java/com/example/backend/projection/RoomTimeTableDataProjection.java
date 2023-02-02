package com.example.backend.projection;

import com.example.backend.entity.studyCenter.Mentor;
import com.example.backend.entity.studyCenter.TimeTableData;
import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

public interface RoomTimeTableDataProjection {


     UUID getId();


     @Value("#{@timeTableDataRepo.getTimeTableDataPro(target.id)}")
     TimeTableData getCustom();


}
