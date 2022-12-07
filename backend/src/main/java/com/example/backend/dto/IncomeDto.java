package com.example.backend.dto;

import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.IncomeType;
import com.example.backend.entity.studyCenter.PayType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomeDto {
    @NotNull
    private Integer amount;

    private String description;

    @NotNull
    private UUID payTypeId;

    @NotNull
    private UUID incomeTypeId;

    @NotNull
    private UUID userId;

}
