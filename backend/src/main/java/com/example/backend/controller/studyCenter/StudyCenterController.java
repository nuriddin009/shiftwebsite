package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ReqTeableUser;
import com.example.backend.dto.ReqTimeTable;
import com.example.backend.dto.ReqTimeTableDeleteUser;
import com.example.backend.entity.studyCenter.Time_table;
import com.example.backend.projection.TimeTableUserProjection;
import com.example.backend.repository.studyCenter.TimeTableRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersDataRepository;
import com.example.backend.service.studyCenter.StudyCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/studyCenter")
public class StudyCenterController {

    private final StudyCenterService studyCenterService;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;
    private final TimeTableRepository timeTableRepository;

    @GetMapping("/timeTables/{groupId}")
    public List<Time_table> getTimeTable(@PathVariable UUID groupId) {
        return studyCenterService.getTimeTable(groupId);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    @PatchMapping("/timeTable/{timeTableId}/{isMore}")
    public Time_table lessOrMore(@PathVariable Integer timeTableId, @PathVariable Boolean isMore) {
        Time_table time_table = timeTableRepository.findById(timeTableId).get();
        time_table.setIsMore(isMore);
        return timeTableRepository.save(time_table);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    @PatchMapping("/edit/timeTableName/{timeTableId}/{timeTableName}")
    public Time_table editTimeTableName(@PathVariable Integer timeTableId, @PathVariable String timeTableName) {
        Time_table time_table = timeTableRepository.findById(timeTableId).get();
        time_table.setTableName(timeTableName);
        return timeTableRepository.save(time_table);
    }


    @GetMapping("/timeTableUsers/getDeleteUsers/{page}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR')")
    public Page<TimeTableUserProjection> timeTableGetDeleteUser(@PathVariable Integer page, @RequestParam(defaultValue = "") String fullname, @RequestParam(defaultValue = "2020-01-01") String stardate, @RequestParam(defaultValue = "2099-01-01") String enddate) {
        return studyCenterService.TimeTableGetDeleteUser(page, fullname, stardate, enddate);
    }

    @GetMapping("/timeTableUsers/{timeTableid}")
    public List<TimeTableUserProjection> getTimeTableUsers(@PathVariable Integer timeTableid) {
        return studyCenterService.getTimeTableUsers(timeTableid);
    }

    @PostMapping("/timeTables/{groupId}/{timeTableName}/{isFree}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public Time_table saveTimeTable(
            @PathVariable UUID groupId,
            @PathVariable String timeTableName,
            @PathVariable Boolean isFree
    ) {
        return studyCenterService.saveTimeTable(groupId, timeTableName, isFree);
    }

    @PostMapping("/timeTablesStart/{tableId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public Time_table editTimeTable(@PathVariable Integer tableId, @RequestBody ReqTimeTable reqTimeTable) {
        return studyCenterService.editTimeTable(tableId, reqTimeTable);
    }


    @PatchMapping("/timeTableUsersData/hasinlesson/{id}/{hasinlesson}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public void getTimeTableUsersDataLesson(@PathVariable Integer id, @PathVariable Boolean hasinlesson) {
        studyCenterService.getTimeTableUsersDataLesson(id, hasinlesson);
    }

    @PatchMapping("/timeTableUsersData/isvideoallowed/{id}/{isvideoallowed}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public ApiResponse getTimeTableUsersDataIsvideoallowed(
            @PathVariable Integer id,
            @PathVariable Boolean isvideoallowed
    ) {
        return studyCenterService.getTimeTableUsersDataIsvideoallowed(id, isvideoallowed);
    }

    @PatchMapping("/timeTableUsersData/lessonhomework/{id}/{mark}/{homework}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public void getTimeTableUsersDataLesson(@PathVariable Integer id, @PathVariable Integer mark, @PathVariable Integer homework) {
        studyCenterService.getTimeTableUsersDatalessonHomework(id, mark, homework);
    }

    @PatchMapping("/timeTableUsersData/lessondone")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public void TimeTableUsersDataLessonDone(@RequestParam Integer lessonId, @RequestParam Integer timeTableId, @RequestParam Boolean telegramIsmessage) {
        studyCenterService.TimeTableUsersDatalessonDone(lessonId, timeTableId, telegramIsmessage);

    }

    @PostMapping("/timeTableUsers")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public ApiResponse saveTimeTableUsers(@RequestBody ReqTeableUser data) {
        return studyCenterService.saveTimeTableUsers(data);
    }

    @PostMapping("/timeTableUsers/deleteUser/{id}/{userId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public ApiResponse TimeTableDeleteUser(
            @PathVariable Integer id,
            @PathVariable UUID userId,
            @RequestBody ReqTimeTableDeleteUser reqTimeTableDeleteUser
    ) {
        return studyCenterService.TimeTableDeleteUser(id, userId, reqTimeTableDeleteUser);
    }

    @PostMapping("/timeTableUsers/exam/{exam}/{lessnId}/{timetableId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public ApiResponse TimetableUserExam(@PathVariable Boolean exam, @PathVariable Integer lessnId, @PathVariable Integer timetableId) {
        return studyCenterService.exam(exam, lessnId, timetableId);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteTTUD(@PathVariable Integer id) {
        timeTableUsersDataRepository.deleteErrorTTUD(id);
    }

}
