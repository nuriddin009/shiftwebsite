package com.example.backend.entity.shift;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class TitleComponent {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;
    private String title;
    private String title_UZB;
    private String title_RUS;
    @Column(length = 800)
    private  String description;
    @Column(length = 800)
    private  String description_UZB;
    @Column(length = 800)
    private  String description_RUS;

    public TitleComponent(String title, String title_UZB, String title_RUS, String description, String description_UZB, String description_RUS) {
        this.title = title;
        this.title_UZB = title_UZB;
        this.title_RUS = title_RUS;
        this.description = description;
        this.description_UZB = description_UZB;
        this.description_RUS = description_RUS;
    }
}
