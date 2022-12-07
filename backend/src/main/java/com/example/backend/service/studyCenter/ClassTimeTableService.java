package com.example.backend.service.studyCenter;


import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.RoomDto;
import com.example.backend.entity.studyCenter.ClassTimeTable;
import com.example.backend.entity.studyCenter.Room;
import com.example.backend.entity.studyCenter.TimeTableData;
import com.example.backend.repository.studyCenter.ClassTimeTableRepository;
import com.example.backend.repository.studyCenter.WeekDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ClassTimeTableService {


    private final ClassTimeTableRepository classTimeTableRepository;
    private final WeekDayRepository weekDayRepository;


    public ApiResponse getAllClassTimeTable() {
        return null;
    }

    public ApiResponse addRoom(RoomDto roomDto) {

        new Room(
                null,
                roomDto.getRoomName(),
                weekDayRepository.findAll()
        );

        TimeTableData timeTableData = new TimeTableData();

        return null;
    }
}
