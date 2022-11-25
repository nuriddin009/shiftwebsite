package com.example.backend.service.studyCenter;


import com.example.backend.entity.studyCenter.Lesson;
import com.example.backend.entity.studyCenter.Time_table_user;
import com.example.backend.entity.studyCenter.Time_table_user_data;
import com.example.backend.projection.CustomTimeTableUser;
import com.example.backend.projection.UserIdProjection;
import com.example.backend.repository.LessonRepository;
import com.example.backend.repository.studyCenter.TimeTableRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersDataRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
@Service
public class LessonService {

    private final TimeTableRepository timeTableRepository;
    private final TimeTableUsersRepository timeTableUsersRepository;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;
    private final LessonRepository lessonRepository;


    public Lesson createNewLesson() {
        Lesson lesson = new Lesson();
        lesson.setIsactive(true);
        Lesson save = lessonRepository.save(lesson);
        save.setLesson_order(save.getId());
        

        List<UserIdProjection> students = timeTableUsersDataRepository.getAllUserForAddTTUD();


        for (UserIdProjection student : students) {
            List<CustomTimeTableUser> byUserId = timeTableUsersRepository.findByUserId(
                    student.getId(),
                    student.getGroupId()
            );

            for (CustomTimeTableUser timeTableUser : byUserId) {
                Time_table_user_data time_table_user_data = new Time_table_user_data();
                time_table_user_data.setTime_table_user(timeTableUsersRepository
                        .findById(timeTableUser.getId()).get());
                time_table_user_data.setDone(false);
                time_table_user_data.setExam(false);
                time_table_user_data.setHasInLesson(false);
                time_table_user_data.setHomeworkMark(0);
                time_table_user_data.setIsvideoallowed(false);
                time_table_user_data.setLessonMark(0);
                time_table_user_data.setLesson_Order(save.getId());
                timeTableUsersDataRepository.save(time_table_user_data);
            }


        }
        return lessonRepository.save(save);
    }


}
