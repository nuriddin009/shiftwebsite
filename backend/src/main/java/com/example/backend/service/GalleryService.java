package com.example.backend.service;

import com.example.backend.entity.shift.Gallery;
import com.example.backend.repository.AttachmentRepository;
import com.example.backend.repository.shiftRepo.GalleryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryService {
    private final GalleryRepo galleryRepo;
    private final AttachmentRepository attachmentRepository;

    @Autowired
    public GalleryService(GalleryRepo galleryRepo, AttachmentRepository attachmentRepository) {
        this.galleryRepo = galleryRepo;
        this.attachmentRepository = attachmentRepository;
    }

    public List<Gallery> getGallery() {
        return galleryRepo.findAllByOrderByCreatedAtDesc();
    }

    public Page<Gallery> getSeeGallery() {
        Pageable page = PageRequest.of(0, 6);
        return galleryRepo.findAllBySeeOrderByCreatedAtDesc(true,page);
    }
    public Page<Gallery> getSeeFourGallery() {
        Pageable page = PageRequest.of(0, 4);
        return galleryRepo.findAllBySeeOrderByCreatedAtDesc(true,page);
    }
    public Page<Gallery> getSeeTwoGallery() {
        Pageable page = PageRequest.of(0, 2);
        return  galleryRepo.findAllBySeeOrderByCreatedAtDesc(true,page);
    }

    public Gallery editGalleryCheck(Gallery gallery) {
        Gallery gallery1 = galleryRepo.findById(gallery.getId()).get();
        gallery1.setSee(gallery.getSee());
        return galleryRepo.save(gallery1);
    }

    public void dragdrob(UUID first,UUID last) {
        Gallery gallery1 = galleryRepo.findById(first).get();
        Timestamp G1_createdAt = gallery1.getCreatedAt();
        Gallery gallery2 = galleryRepo.findById(last).get();
        Timestamp G2_createdAt = gallery2.getCreatedAt();
        gallery1.setCreatedAt(G2_createdAt);
        gallery2.setCreatedAt(G1_createdAt);
        galleryRepo.save(gallery1);
        galleryRepo.save(gallery2);
    }

    public void deleteFoto(UUID id) {
        galleryRepo.deleteById(id);
    }

}
