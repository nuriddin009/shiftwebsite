package com.example.backend.entity.shift;

import com.example.backend.entity.Attachment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;
    private String title;
    private String description;
    private String title_UZB;
    private String title_RUS;
    private String description_UZB;
    private String description_RUS;
    @CreationTimestamp
    private Timestamp createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    private String filePath = "/home/courses/" + getId();

    public Course(String title, String description, String title_UZB, String title_RUS, String description_UZB, String description_RUS, Attachment attachment) {
        this.title = title;
        this.description = description;
        this.title_UZB = title_UZB;
        this.title_RUS = title_RUS;
        this.description_UZB = description_UZB;
        this.description_RUS = description_RUS;
        this.attachment = attachment;
    }
}
