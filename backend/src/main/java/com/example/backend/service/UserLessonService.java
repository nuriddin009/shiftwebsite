package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.projection.TimeTableDataUserProjection;
import com.example.backend.projection.UserLessonProjection;
import com.example.backend.projection.UserProjection;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.TimeTableRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserLessonService {
    private final TimeTableRepository timeTableRepository;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;
    private final UserRepository userRepository;

    public UserLessonService(TimeTableRepository timeTableRepository, TimeTableUsersDataRepository timeTableUsersDataRepository, UserRepository userRepository) {
        this.timeTableRepository = timeTableRepository;
        this.timeTableUsersDataRepository = timeTableUsersDataRepository;
        this.userRepository = userRepository;
    }

    public List<TimeTableDataUserProjection> getUserLesson(String username) {
        User user = userRepository.findByUsername(username).get();
        return timeTableRepository.getuserlesson(user.getId());
    }

    public void deleteTTUD(Integer id) {
        timeTableUsersDataRepository.deleteErrorTTUD(id);
    }

    public List<UserLessonProjection> getLessonsForMentor(UUID userId) {
        return timeTableUsersDataRepository.getAllLessonForMentor(userId);
    }

    public List<UserLessonProjection> getUserLesson(Integer id, String user) {
        UserProjection userProjection = userRepository.getUserName(user).get();
        return timeTableUsersDataRepository.getOneData(id, userProjection.getId());

    }

    public List<TimeTableDataUserProjection> getTimeTable(UUID userid, Integer timetableid) {
        return timeTableUsersDataRepository.getLessonUser(userid, timetableid);
    }
}
