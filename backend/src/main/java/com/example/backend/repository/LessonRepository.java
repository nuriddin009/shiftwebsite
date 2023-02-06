package com.example.backend.repository;

import com.example.backend.entity.studyCenter.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson,Integer> {
    @Query(value = "select l from Lesson  l order by l.lesson_order")
    List<Lesson> getLesson();



    @Query(value = "select l from  Lesson  l where l.lesson_order=:lesson")
    Lesson getoneLesson(Integer lesson);

}
