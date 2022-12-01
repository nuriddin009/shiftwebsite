package com.example.backend.entity.studyCenter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class TimeTableUserData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    TimeTableUser time_tableUser;
    private Integer lesson_Order;
    private Boolean done;
    private Boolean hasInLesson;
    private Integer homeworkMark;
    private Integer lessonMark;
    private Boolean exam;
    private Boolean isvideoallowed;

    public TimeTableUserData(TimeTableUser time_tableUser, Integer lesson_Order, Boolean hasInLesson, Integer homeworkMark, Integer lessonMark, Boolean done, Boolean exam, Boolean isvideoallowed) {
        this.time_tableUser = time_tableUser;
        this.lesson_Order = lesson_Order;
        this.hasInLesson = hasInLesson;
        this.homeworkMark = homeworkMark;
        this.lessonMark = lessonMark;
        this.done = done;
        this.exam = exam;
        this.isvideoallowed=isvideoallowed;
    }
}
