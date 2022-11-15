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
public class Gallery {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;
    private String URL;

    private Boolean see;
    @CreationTimestamp
    private Timestamp createdAt;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sort;
    @ManyToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    public Gallery(Attachment attachment) {
        this.attachment = attachment;
    }
}
