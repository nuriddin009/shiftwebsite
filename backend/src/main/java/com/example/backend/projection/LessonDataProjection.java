package com.example.backend.projection;


public interface LessonDataProjection {
     Integer getId();
     Integer getLessonorder();
     Boolean getHasinlesson();
     Integer getHomeworkmark();
     Integer getLessonmark();
     Boolean getDone();
     Boolean getExam();

     Boolean getIsvideoallowed();

}
