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
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "class_time_table")
//public class ClassTimeTable {
//    @Id
//    @GeneratedValue(generator = "UUID")
//    @GenericGenerator(
//            name = "UUID",
//            strategy = "org.hibernate.id.UUIDGenerator"
//    )
//    private UUID id;
//
//    @Column(nullable = false)
//    private String time;
//
//    @ManyToMany(fetch = FetchType.LAZY)
//    private List<Room> rooms;
//}
