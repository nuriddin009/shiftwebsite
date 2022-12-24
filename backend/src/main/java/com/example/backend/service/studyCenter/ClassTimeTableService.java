package com.example.backend.service.studyCenter;


import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ClassTimeDto;
import com.example.backend.dto.RoomDto;
import com.example.backend.dto.TimeDataDto;
import com.example.backend.entity.enums.WeekEnum;
import com.example.backend.entity.studyCenter.ClassTimeTable;
import com.example.backend.entity.studyCenter.Room;
import com.example.backend.entity.studyCenter.TimeTableData;
import com.example.backend.repository.studyCenter.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ClassTimeTableService {


    private final ClassTimeTableRepository classTimeTableRepository;
    private final RoomRepository roomRepository;
    private final TimeTableDataRepo timeTableDataRepo;
    private final MentorRepo mentorRepo;
    private final GroupRepository groupRepository;


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


    public ApiResponse changeRoomName(UUID id, String roomName) {
        Room room = roomRepository.findById(id).get();
        room.setRoomName(roomName);
        roomRepository.save(room);
        return new ApiResponse(true, "Room name changed");
    }

    public ApiResponse changeTime(UUID id, String typeTime, String timeValue) {
        ClassTimeTable classTimeTable = classTimeTableRepository.findById(id).get();
        if (typeTime.equals("start")) {
            classTimeTable.setStartTime(timeValue);
        } else {
            classTimeTable.setEndTime(timeValue);
        }
        classTimeTableRepository.save(classTimeTable);
        return new ApiResponse(true, typeTime + " time changed");
    }

    public ApiResponse changeTimeData(TimeDataDto timeDataDto) {
        TimeTableData timeTableData = timeTableDataRepo.findById(timeDataDto.getId()).get();
        timeTableData.setTable_mentor(mentorRepo.getReferenceById(timeDataDto.getMentorId()));
        timeTableData.setGroup(groupRepository.getReferenceById(timeDataDto.getGroupId()));
        timeTableDataRepo.save(timeTableData);
        return new ApiResponse(true, "Time data saved");
    }

    public ApiResponse getRoomTimes(UUID id) {
        List<ClassTimeTable> byRoomId = classTimeTableRepository.findByRoomIdOrderByCreated(id);
        return new ApiResponse(true, byRoomId);
    }

    @Transactional
    @Modifying
    public ApiResponse deleteTime(UUID id) {

        timeTableDataRepo.deleteData(id);

        classTimeTableRepository.deleteById(id);
        return new ApiResponse(true, "Time deleted");
    }

    public ApiResponse addRoomTime(UUID id) {
        ClassTimeTable classTimeTable = new ClassTimeTable("", "", roomRepository.findById(id).get());
        ClassTimeTable save = classTimeTableRepository.save(classTimeTable);

        for (int i = 0; i < Arrays.stream(WeekEnum.values()).count(); i++) {
            timeTableDataRepo.save(new TimeTableData("", "",
                    save,
                    Arrays.stream(WeekEnum.values()).collect(Collectors.toList()).get(i),
                    i + 1
            ));
        }

        return new ApiResponse(true, "Time added");
    }
}
