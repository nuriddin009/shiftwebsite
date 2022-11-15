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
public class OurTeam {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;
    private String name;
    private String description;
    private String name_UZB;
    private String name_RUS;
    private String description_UZB;
    private String description_RUS;
    private String ImgUrl;
    @CreationTimestamp
    private Timestamp createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    private String filePath = "/home/ourteam/" + getId();

    public OurTeam(String name, String description, String name_UZB, String name_RUS, String description_UZB, String description_RUS, Attachment attachment) {
        this.name = name;
        this.description = description;
        this.name_UZB = name_UZB;
        this.name_RUS = name_RUS;
        this.description_UZB = description_UZB;
        this.description_RUS = description_RUS;
        this.attachment = attachment;
    }
}
