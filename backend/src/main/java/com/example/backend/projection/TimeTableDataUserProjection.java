package com.example.backend.projection;

public interface TimeTableDataUserProjection {
    Integer getId();

    Boolean getIsvideoallowed();

    Integer getLesson_mark();

    Integer getHomework_mark();

    Boolean getExam();

    Boolean getHas_in_lesson();

    Boolean getDone();

    String getVideo_url();

    String getHash();

}
