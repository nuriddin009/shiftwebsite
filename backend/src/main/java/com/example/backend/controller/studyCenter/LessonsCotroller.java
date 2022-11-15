package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ReqLessonUrl;
import com.example.backend.entity.studyCenter.Lesson;
import com.example.backend.entity.studyCenter.LessonHash;
import com.example.backend.entity.studyCenter.Lesson_url;
import com.example.backend.repository.LessonRepository;
import com.example.backend.repository.LessonUrlRepository;
import com.example.backend.repository.studyCenter.LessonHashRepository;
import com.example.backend.service.studyCenter.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/lessons")
public class LessonsCotroller {


    private final LessonRepository lessonRepository;
    private final LessonUrlRepository lessonUrlRepository;
    private final LessonService lessonService;
    private final LessonHashRepository lessonHashRepository;

    @GetMapping("/addNewLesson")
    public Lesson addNewLesson() {
        return lessonService.createNewLesson();
    }

    @GetMapping
    public List<Lesson> get() {
        return lessonRepository.getLesson();
    }

    @GetMapping("{lessonId}")
    public Lesson getOneLesson(@PathVariable Integer lessonId) {
        return lessonRepository.findById(lessonId).get();
    }

    @GetMapping("/urls/{lessonId}")
    public List<Lesson_url> getLessonUrl(@PathVariable Integer lessonId) {
        return lessonUrlRepository.findLessonId(lessonId);
    }

    @PostMapping("/urls/{lessonId}")
    public Lesson_url addLessonUrl(@PathVariable Integer lessonId) {
        Optional<Lesson> byId = lessonRepository.findById(lessonId);
        Lesson_url lesson_url = new Lesson_url(null, null, lessonUrlRepository.findAll().size() + 1, byId.get());
        return lessonUrlRepository.save(lesson_url);
    }

    @PutMapping("/urls/url")
    public Lesson_url addLessonUrl(@RequestBody ReqLessonUrl reqLessonUrl) {
        Lesson_url lesson_url = lessonUrlRepository.findById(reqLessonUrl.getId()).get();
        lesson_url.setUrl_video(reqLessonUrl.getUrl());

        return lessonUrlRepository.save(lesson_url);
    }

    @DeleteMapping("/urls/{id}")
    public void deletelessonUrl(@PathVariable Integer id) {
        lessonUrlRepository.deleteById(id);
    }

    @PostMapping()
    public Lesson save(@RequestParam String url) {
        List<Lesson> all = lessonRepository.findAll();
        Integer lesson_order = all.get(all.size() - 1).getLesson_order() + 1;
        return lessonRepository.save(new Lesson(null, lesson_order, url, true));
    }

    @PutMapping()
    public Lesson editURl(@RequestParam Integer id, @RequestParam String url) {

        Optional<Lesson> byId = lessonRepository.findById(id);
        if (byId.isPresent()) {
            byId.get().setVideoUrl(url);
            return lessonRepository.save(byId.get());
        }
        return null;
    }

    @DeleteMapping
    private void disActiveLesson(@RequestParam Integer id) {
        Lesson lesson = lessonRepository.findById(id).get();
        lesson.setIsactive(!lesson.getIsactive());
        lessonRepository.save(lesson);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/deleteLesson/{id}")
    public void deleteLesson(@PathVariable Integer id) {
        Lesson lesson = lessonRepository.findById(id).get();

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
