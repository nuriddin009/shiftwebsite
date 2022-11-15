package com.example.backend.repository.shiftRepo;


import com.example.backend.entity.shift.OurTeam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OurTeamRepo extends JpaRepository<OurTeam, UUID> {
   List<OurTeam> findAllByOrderByCreatedAtDesc();
}
