package com.example.backend.entity.shift;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;
    private String address;
    private String address_UZB;
    private String address_RUS;
    private String number;

    public Address(String address, String address_UZB, String address_RUS, String number) {
        this.address = address;
        this.address_UZB = address_UZB;
        this.address_RUS = address_RUS;
        this.number = number;
    }
}
