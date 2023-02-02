package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.RoomDto;
import com.example.backend.dto.TimeDataDto;
import com.example.backend.service.studyCenter.ClassTimeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/classTimeTable")
public class ClassTimeTableController {


    private final ClassTimeTableService classTimeTableService;


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse> getClassTimeTables() {
        return ResponseEntity.ok(classTimeTableService.getAllClassTimeTable());
    }

    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse> getRooms() {
        return ResponseEntity.ok(classTimeTableService.getRooms());
    }


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/timeTableData")
    public ResponseEntity<ApiResponse> getTimeTableDatas() {
        return ResponseEntity.ok(classTimeTableService.getTimeTableData());
    }

    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping("/addRoom")
    public HttpEntity<ApiResponse> addRoom(@RequestBody RoomDto roomDto) {
        return ResponseEntity.ok(classTimeTableService.addRoom(roomDto));
    }


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/change/room/name")
    public HttpEntity<ApiResponse> changeRoomName(
            @RequestParam UUID id,
            @RequestParam String roomName
    ) {
        return ResponseEntity.ok(classTimeTableService.changeRoomName(id, roomName));
    }


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/change/time")
    public HttpEntity<ApiResponse> changeTime(
            @RequestParam UUID id,
            @RequestParam String typeTime,
            @RequestParam String timeValue
    ) {
        return ResponseEntity.ok(classTimeTableService.changeTime(id, typeTime, timeValue));
    }


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PutMapping("/change/timeData")
    public HttpEntity<ApiResponse> changeTimeData(@RequestBody @Valid TimeDataDto timeDataDto) {
        return ResponseEntity.ok(classTimeTableService.changeTimeData(timeDataDto));
    }


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/roomTime/{id}")
    public HttpEntity<ApiResponse> getRoomTimes(@PathVariable UUID id) {
        return ResponseEntity.ok(classTimeTableService.getRoomTimes(id));
    }


    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/roomTime/{id}")
    public HttpEntity<ApiResponse> deleteTime(@PathVariable UUID id){
        return ResponseEntity.ok(classTimeTableService.deleteTime(id));
    }

    @PreAuthorize(value = "hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/add/roomTime/{id}")
    public HttpEntity<ApiResponse> addRoomTime(@PathVariable UUID id){
        return ResponseEntity.ok(classTimeTableService.addRoomTime(id));
    }

}
