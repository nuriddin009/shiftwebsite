//package com.example.backend.entity.studyCenter;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.GenericGenerator;
//
//import javax.persistence.*;
//import java.util.List;
//import java.util.UUID;
//
//@Entity
//@AllArgsConstructor
//@NoArgsConstructor
//@Data
//@Table(name = "rooms")
//public class Room {
//    @Id
//    @GeneratedValue(generator = "UUID")
//    @GenericGenerator(
//            name = "UUID",
//            strategy = "org.hibernate.id.UUIDGenerator"
//    )
//    private UUID id;
//
//    @Column(nullable = false)
//    private String roomName;
//
//    @ManyToMany
//    private List<WeekDay> weekDays;
//}
