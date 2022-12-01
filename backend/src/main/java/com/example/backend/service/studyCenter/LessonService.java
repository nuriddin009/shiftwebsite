package com.example.backend.service.studyCenter;


import com.example.backend.dto.ReqLessonUrl;
import com.example.backend.entity.studyCenter.Lesson;
import com.example.backend.entity.studyCenter.LessonHash;
import com.example.backend.entity.studyCenter.Lesson_url;
import com.example.backend.entity.studyCenter.TimeTableUserData;
import com.example.backend.projection.CustomTimeTableUser;
import com.example.backend.projection.UserIdProjection;
import com.example.backend.repository.LessonRepository;
import com.example.backend.repository.LessonUrlRepository;
import com.example.backend.repository.studyCenter.LessonHashRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersDataRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LessonService {
    private final LessonRepository lessonRepository;
    private final LessonUrlRepository lessonUrlRepository;
    private final LessonHashRepository lessonHashRepository;
    private final TimeTableUsersRepository timeTableUsersRepository;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;


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
                TimeTableUserData timeTableUserData = new TimeTableUserData(
                        timeTableUsersRepository.getReferenceById(timeTableUser.getId()),
                        save.getId(), false, 0, 0, false,
                        false, false
                );
                timeTableUsersDataRepository.save(timeTableUserData);
            }


        }
        return lessonRepository.save(save);
    }


    public List<Lesson> getLesson() {
        return lessonRepository.getLesson();
    }

    public Lesson getOneLesson(Integer lessonId) {
        return lessonRepository.getReferenceById(lessonId);
    }

    public List<Lesson_url> getLessonUrl(Integer lessonId) {
        return lessonUrlRepository.findLessonId(lessonId);
    }

    public Lesson_url addLessonUrl(Integer lessonId) {
        Lesson_url lesson_url = new Lesson_url(null, null, lessonUrlRepository.findAll().size() + 1, lessonRepository.getReferenceById(lessonId));
        return lessonUrlRepository.save(lesson_url);
    }

    public Lesson_url addLessonUrl1(ReqLessonUrl reqLessonUrl) {
        Lesson_url lesson_url = lessonUrlRepository.getReferenceById(reqLessonUrl.getId());
        lesson_url.setUrl_video(reqLessonUrl.getUrl());
        return lessonUrlRepository.save(lesson_url);
    }

    public void deleteLessonUrl(Integer id) {
        lessonUrlRepository.deleteById(id);
    }

    public Lesson save(String url) {
        List<Lesson> all = lessonRepository.findAll();
        Integer lesson_order = all.get(all.size() - 1).getLesson_order() + 1;
        return lessonRepository.save(new Lesson(null, lesson_order, url, true));
    }

    public Lesson editURl(Integer id, String url) {
        Optional<Lesson> byId = lessonRepository.findById(id);
        if (byId.isPresent()) {
            byId.get().setVideoUrl(url);
            return lessonRepository.save(byId.get());
        }
        return null;
    }

    public void disActiveLesson(Integer id) {
        Lesson lesson = lessonRepository.getReferenceById(id);
        lesson.setIsactive(!lesson.getIsactive());
        lessonRepository.save(lesson);
    }

    public void deleteLesson(Integer id) {
        Lesson lesson = lessonRepository.getReferenceById(id);

        List<LessonHash> byLessonId = lessonHashRepository.findByLessonId(lesson.getId());
        for (LessonHash lessonHash : byLessonId) {
            lessonHashRepository.deleteById(lessonHash.getId());
        }

        List<Lesson_url> lessonUrls = lessonUrlRepository.findLessonId(lesson.getId());
        for (Lesson_url lessonUrl : lessonUrls) {
            lessonUrlRepository.deleteById(lessonUrl.getId());
        }

        lessonRepository.deleteById(lesson.getId());
    }
}
