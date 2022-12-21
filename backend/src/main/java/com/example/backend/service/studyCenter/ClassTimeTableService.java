package com.example.backend.service.studyCenter;


import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ClassTimeDto;
import com.example.backend.dto.RoomDto;
import com.example.backend.entity.enums.WeekEnum;
import com.example.backend.entity.studyCenter.ClassTimeTable;
import com.example.backend.entity.studyCenter.Room;
import com.example.backend.entity.studyCenter.TimeTableData;
import com.example.backend.repository.studyCenter.ClassTimeTableRepository;
import com.example.backend.repository.studyCenter.RoomRepository;
import com.example.backend.repository.studyCenter.TimeTableDataRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ClassTimeTableService {


    private final ClassTimeTableRepository classTimeTableRepository;
    private final RoomRepository roomRepository;
    private final TimeTableDataRepo timeTableDataRepo;


    public ApiResponse getAllClassTimeTable() {
        return new ApiResponse(true, classTimeTableRepository.getClassTimeTableBy());
    }


    public ApiResponse getRooms() {
        return new ApiResponse(true, roomRepository.getRoomsBy());
    }


    public ApiResponse getTimeTableData() {
        return new ApiResponse(true, roomRepository.getRoomsTables());
    }


    public ApiResponse addRoom(RoomDto roomDto) {


        Room room = new Room(roomDto.getRoomName());
        Room save = roomRepository.save(room);


        for (ClassTimeDto classTimeTableDto : roomDto.getClassTimeTables()) {
            ClassTimeTable classTimeTable = classTimeTableRepository.save(new ClassTimeTable(
                    classTimeTableDto.getStartTime(), classTimeTableDto.getEndTime(), save));


            for (int i = 0; i < Arrays.stream(WeekEnum.values()).count(); i++) {
                timeTableDataRepo.save(new TimeTableData("", "",
                        classTimeTable,
                        Arrays.stream(WeekEnum.values()).collect(Collectors.toList()).get(i),
                        i + 1
                ));
            }

        }

        return new ApiResponse(true, "Room added");
    }


}
