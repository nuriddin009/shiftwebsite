package com.example.backend.controller.studyCenter;

import com.example.backend.dto.ReqLessonUrl;
import com.example.backend.entity.studyCenter.Lesson;
import com.example.backend.entity.studyCenter.Lesson_url;
import com.example.backend.service.studyCenter.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/lessons")
public class LessonsCotroller {

    private final LessonService lessonService;


    @GetMapping("/addNewLesson")
    public Lesson addNewLesson() {
        return lessonService.createNewLesson();
    }

    @GetMapping
    public List<Lesson> get() {
        return lessonService.getLesson();
    }

    @GetMapping("{lessonId}")
    public Lesson getOneLesson(@PathVariable Integer lessonId) {
        return lessonService.getOneLesson(lessonId);
    }

    @GetMapping("/urls/{lessonId}")
    public List<Lesson_url> getLessonUrl(@PathVariable Integer lessonId) {
        return lessonService.getLessonUrl(lessonId);
    }

    @PostMapping("/urls/{lessonId}")
    public Lesson_url addLessonUrl(@PathVariable Integer lessonId) {
        return lessonService.addLessonUrl(lessonId);
    }

    @PutMapping("/urls/url")
    public Lesson_url addLessonUrl(@RequestBody ReqLessonUrl reqLessonUrl) {
        return lessonService.addLessonUrl1(reqLessonUrl);
    }

    @DeleteMapping("/urls/{id}")
    public void deletelessonUrl(@PathVariable Integer id) {
        lessonService.deleteLessonUrl(id);
    }

    @PostMapping()
    public Lesson save(@RequestParam String url) {
        return lessonService.save(url);
    }

    @PutMapping()
    public Lesson editURl(@RequestParam Integer id, @RequestParam String url) {
        return lessonService.editURl(id, url);
    }

    @DeleteMapping
    private void disActiveLesson(@RequestParam Integer id) {
        lessonService.disActiveLesson(id);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/deleteLesson/{id}")
    public void deleteLesson(@PathVariable Integer id) {
        lessonService.deleteLesson(id);
    }

}
