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
public class Time_table_user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Time_table time_table;
    @ManyToOne
    private User user;
    private String price;

    private Integer gotogroup;
    private String whytogroup;
    private LocalDate deletedate;

    public Time_table_user(Time_table time_table, User user, String price, Integer gotogroup) {
        this.time_table = time_table;
        this.user = user;
        this.price = price;
        this.gotogroup = gotogroup;
    }

}
