package com.example.backend.controller.studyCenter;

import com.example.backend.entity.User;
import com.example.backend.projection.TimeTableDataUserProjection;
import com.example.backend.projection.UserLessonProjection;
import com.example.backend.projection.UserProjection;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.TimeTableRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/UserLesson")
public class UserLessonController {

    private final TimeTableRepository timeTableRepository;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;
    private final UserRepository userRepository;

    @GetMapping("/{username}")
    public List<TimeTableDataUserProjection> getUserLesson(@PathVariable String username) {
        User user = userRepository.findByUsername(username).get();
        return timeTableRepository.getuserlesson(user.getId());
    }


    @DeleteMapping("/deleteT")
    public void deleteTTUD(
            @RequestParam Integer id
    ) {
        timeTableUsersDataRepository.deleteErrorTTUD(id);
    }

    @PreAuthorize("hasRole('ROLE_MENTOR')")
    @GetMapping("/mentor/lessons")
    public List<UserLessonProjection> getLessonsForMentor(@RequestParam UUID userId) {
        return timeTableUsersDataRepository.getAllLessonForMentor(userId);
    }

    @GetMapping("/lesson/{id}/{user}")
    public List<UserLessonProjection> getUserLesson(@PathVariable Integer id, @PathVariable String user) {
        UserProjection userProjection = userRepository.getUserName(user).get();
        return timeTableUsersDataRepository.getOneData(id, userProjection.getId());
    }

    @GetMapping("all/{userid}/{timetableid}")
    public List<TimeTableDataUserProjection> getTimeTable(@PathVariable UUID userid, @PathVariable Integer timetableid) {
        return timeTableUsersDataRepository.getLessonUser(userid, timetableid);
    }
}
