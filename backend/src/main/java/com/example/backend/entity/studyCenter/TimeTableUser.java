package com.example.backend.entity.studyCenter;

import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class TimeTableUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Time_table time_table;
    @ManyToOne
    private User user;
    private String price;
    private int paid=0;

    private Integer gotogroup;
    private String whytogroup;
    private LocalDate deletedate;

    public TimeTableUser(Time_table time_table, User user, String price, Integer gotogroup) {
        this.time_table = time_table;
        this.user = user;
        this.price = price;
        this.gotogroup = gotogroup;
    }

}
