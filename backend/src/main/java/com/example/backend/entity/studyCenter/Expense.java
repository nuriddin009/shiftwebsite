package com.example.backend.entity.studyCenter;

import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "expense")
public class Expense {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    @Column(nullable = false)
    private int amount;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "pay_type_id", nullable = false)
    private PayType payType;

    @ManyToOne
    @JoinColumn(name = "user_id", updatable = false, nullable = false)
    @CreatedBy
    private User user;

    private Boolean deleted;


    @CreationTimestamp
    private LocalDateTime created;

    @UpdateTimestamp
    private LocalDateTime updated;


    public Expense(int amount, String description, String title, PayType payType) {
        this.amount = amount;
        this.description = description;
        this.title = title;
        this.payType = payType;
    }
}
