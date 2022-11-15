package com.example.backend.projection;

import com.example.backend.entity.studyCenter.Lesson_url;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface UserLessonProjection {
    Integer getId();

    String getHash();

    String getUrl_video();
}
