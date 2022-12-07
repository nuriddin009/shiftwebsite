package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;
    @Column(unique = true, length = 50)
    private String username;
    @JsonIgnore
    private String password;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String phoneNumber;

    private String fatherPhoneNumber;


    private String chartId;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;
    @CreationTimestamp
    private Timestamp createdAt;
    private Integer age;
    @Column(length = 100)
    private String address;

    private Boolean activ;

    @ManyToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    private String filePath = "/users/" + getId();

    private int balance=0;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User(String username, String password, List<Role> roles, Integer age, String address) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.age = age;
        this.address = address;
    }

    public User(String username, String password, String firstName, String lastName, String phoneNumber, List<Role> roles, Integer age, String address, Boolean activ, String fatherPhoneNumber) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.age = age;
        this.address = address;
        this.activ = activ;
        this.fatherPhoneNumber = fatherPhoneNumber;
    }
}
