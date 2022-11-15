package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserIpAdress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String ipAdress;
    private Integer count;

    @OneToOne
    private User user;

    public UserIpAdress(String ipAdress, Integer count, User user) {
        this.ipAdress = ipAdress;
        this.count = count;
        this.user = user;
    }
}

