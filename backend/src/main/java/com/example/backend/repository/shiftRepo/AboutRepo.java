package com.example.backend.repository.shiftRepo;

import com.example.backend.entity.shift.AboutComponent;
import com.example.backend.projection.AboutProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface AboutRepo extends JpaRepository<AboutComponent, UUID> {
    @Query(value = "select cast(id as varchar ) as id,  description, title from about_component",nativeQuery = true)
    AboutProjection findByENG();
    @Query(value = "select cast(id as varchar ) as id, description_rus as description,title_rus as title from about_component",nativeQuery = true)
    AboutProjection findByRUS();
    @Query(value = "select cast(id as varchar ) as id, description_uzb as description,title_uzb as title from about_component",nativeQuery = true)
    AboutProjection findByUZ();
}
