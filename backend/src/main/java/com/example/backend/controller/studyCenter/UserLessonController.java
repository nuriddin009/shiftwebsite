package com.example.backend.controller.studyCenter;

import com.example.backend.projection.TimeTableDataUserProjection;
import com.example.backend.projection.UserLessonProjection;
import com.example.backend.service.UserLessonService;
import com.example.backend.service.UserSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/UserLesson")
public class UserLessonController {

    private final UserLessonService service;
    private final UserSession userSession;

    @GetMapping()
    public List<TimeTableDataUserProjection> getUserLesson() {
        return service.getUserLesson(userSession.getUsername());
    }


    @DeleteMapping("/deleteT")
    public void deleteTTUD( @RequestParam Integer id ) {
        service.deleteTTUD(id);
    }

    @PreAuthorize("hasRole('ROLE_MENTOR')")
    @GetMapping("/mentor/lessons")
    public List<UserLessonProjection> getLessonsForMentor(@RequestParam UUID userId) {
        return service.getLessonsForMentor(userId);
    }

    @GetMapping("/lesson/{id}")
    public List<UserLessonProjection> getUserLesson(@PathVariable Integer id) {
       return service.getUserLesson(id, userSession.getUsername());
    }

    @GetMapping("all/{userid}/{timetableid}")
    public List<TimeTableDataUserProjection> getTimeTable(@PathVariable UUID userid, @PathVariable Integer timetableid) {
        return service.getTimeTable(userid,timetableid);
    }
}
