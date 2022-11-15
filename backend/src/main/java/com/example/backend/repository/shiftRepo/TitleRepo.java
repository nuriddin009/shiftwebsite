package com.example.backend.repository.shiftRepo;

import com.example.backend.projection.AboutProjection;
import com.example.backend.entity.shift.TitleComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface TitleRepo extends JpaRepository<TitleComponent, UUID> {
    @Query(value = "select cast(id as varchar ) as id, description , title from title_component",nativeQuery = true)
    AboutProjection findByENG();
    @Query(value = "select cast(id as varchar ) as id, description_rus as description,title_rus as title from title_component",nativeQuery = true)
    AboutProjection findByRUS();
    @Query(value = "select cast(id as varchar ) as id, description_uzb as description,title_uzb as title from title_component",nativeQuery = true)
    AboutProjection findByUZ();
}
