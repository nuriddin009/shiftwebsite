package com.example.backend.repository;
import com.example.backend.entity.UserIpAdress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IpAdressUserRepository extends JpaRepository<UserIpAdress, Integer> {
    Optional<UserIpAdress> findByIpAdress(String ipAdress);

    Optional<UserIpAdress> findByUserId(UUID userId);
}
