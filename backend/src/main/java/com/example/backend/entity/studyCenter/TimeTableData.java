package com.example.backend.entity.studyCenter;

import com.example.backend.entity.enums.WeekEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "time_table_data")
public class TimeTableData {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;


    @Column(nullable = false)
    private String mentor;


    @Column(nullable = false)
    private String groupName;

    @ManyToOne
    private ClassTimeTable classTimeTable;

    @Enumerated(EnumType.STRING)
    private WeekEnum weekday;

    private Integer weekOrder;


    @CreationTimestamp
    private LocalDateTime created;

    @UpdateTimestamp
    private LocalDateTime updated;


    @ManyToOne
    private Mentor table_mentor;

    @ManyToOne
    private Group group;


    public TimeTableData(String mentor, String groupName, ClassTimeTable classTimeTable, WeekEnum weekday, Integer weekOrder) {
        this.mentor = mentor;
        this.groupName = groupName;
        this.classTimeTable = classTimeTable;
        this.weekday = weekday;
        this.weekOrder = weekOrder;
    }
}
