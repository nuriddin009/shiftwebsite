package com.example.backend.entity.telegramBot;

import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String chatId;

    @ManyToMany
    private List<User> user;

    private Integer buttonId;

    private String step;

    private String phoneNumber;

    public Parent(String chatId) {
        this.chatId = chatId;
    }
}
