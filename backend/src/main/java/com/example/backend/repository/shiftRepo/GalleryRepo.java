package com.example.backend.repository.shiftRepo;

import com.example.backend.entity.shift.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GalleryRepo extends JpaRepository<Gallery, UUID> {
    List<Gallery> findAllBySee(Boolean see);
    Page<Gallery> findAllBySeeOrderByCreatedAtDesc(Boolean see, Pageable pageable);


    List<Gallery> findAllByOrderByCreatedAtDesc();
}
