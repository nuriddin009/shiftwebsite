package com.example.backend.entity.studyCenter;

import com.example.backend.entity.User;
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
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "income")
public class Income {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    @Column(nullable = false)
    private int amount;

    private String description;

    @ManyToOne
    @JoinColumn(name = "pay_type_id", nullable = false)
    private PayType payType;

    @ManyToOne
    @JoinColumn(name = "income_type_id", nullable = false)
    private IncomeType incomeType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime created;

    @UpdateTimestamp
    private LocalDateTime updated;

    private Boolean deleted;

    private Boolean usd=false;
    public Income(int amount, String description, PayType payType, IncomeType incomeType, User user) {
        this.amount = amount;
        this.description = description;
        this.payType = payType;
        this.incomeType = incomeType;
        this.user = user;
    }
}
