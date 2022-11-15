package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.LessonHash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonHashRepository extends JpaRepository<LessonHash, Integer> {
    @Query(value = "select  t from  LessonHash  t where t.user.id=:id and t.lesson.id=:lesson")
    List<LessonHash> findOneLessonHash(UUID id, Integer lesson);

    @Transactional
    @Modifying
    @Query(value = "delete from lesson_hash lh where lh.user_id=:userId", nativeQuery = true)
    void deleteLessonHashUserId(UUID userId);

    Optional<LessonHash> findByUserId(UUID userId);

    @Query(value = "select * from lesson_hash lh where lh.lesson_id=:lessonId", nativeQuery = true)
    List<LessonHash> findByLessonId(Integer lessonId);


    @Modifying
    @Transactional
    @Query(value = "delete\n" +
            "from lesson_hash lh\n" +
            "where lh.user_id = :userId", nativeQuery = true)
    void deleteByUserId(UUID userId);


}
