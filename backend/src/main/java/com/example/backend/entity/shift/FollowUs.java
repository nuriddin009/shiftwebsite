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
public class FollowUs {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    private String name;
    private String URL;
    private String imgURL;
    @CreationTimestamp
    private Timestamp createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    private String filePath = "/home/media/" + getId();

    public FollowUs(String name, String URL, String imgURL, Attachment attachment) {
        this.name = name;
        this.URL = URL;
        this.imgURL = imgURL;
        this.attachment = attachment;
    }
}
