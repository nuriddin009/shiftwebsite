package com.example.backend.entity.studyCenter;

import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "lesson_hash"
        ,
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lesson_url_id"})
)
public class LessonHash {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(optional = false)
    User user;
    @ManyToOne(optional = false)
    Lesson lesson;
    @Column(nullable = false)
    String  hash;
    @ManyToOne
    Lesson_url lesson_url;
}
