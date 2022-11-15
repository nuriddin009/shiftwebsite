package com.example.backend.repository;

import com.example.backend.entity.studyCenter.Lesson_url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface LessonUrlRepository extends JpaRepository<Lesson_url, Integer> {

    @Query(value = "select * from lesson_url where lesson_id=:lessonId order by lesson_url.url_order", nativeQuery = true)
    List<Lesson_url> findLessonId(Integer lessonId);

}
