package com.example.backend.repository.shiftRepo;

import com.example.backend.entity.shift.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AddressRepo extends JpaRepository<Address, UUID> {
}
