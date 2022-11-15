package com.example.backend.entity.studyCenter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Time_table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer name;

    private Boolean isStart;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isFree;
    private String price;
    private Boolean isMore = true;

    private String tableName;
    @ManyToOne
    private Group group;

    public Time_table(Integer name, Boolean isStart, Group group, Boolean isFree, String tableName) {
        this.name = name;
        this.isStart = isStart;
        this.group = group;
        this.isFree = isFree;
        this.tableName = tableName;
    }

}
