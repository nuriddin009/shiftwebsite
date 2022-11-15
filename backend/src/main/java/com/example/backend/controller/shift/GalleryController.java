package com.example.backend.controller.shift;

import com.example.backend.entity.shift.Gallery;
import com.example.backend.service.GalleryService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {
    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }
    @GetMapping("/see")
    public Page<Gallery> getSeeGallery(){
        return galleryService.getSeeGallery();
    }
    @GetMapping("/see/four")
    public Page<Gallery> getSeeFourGallery(){
        return galleryService.getSeeFourGallery();
    }
    @GetMapping("/see/two")
    public Page<Gallery> getSeeTwoGallery(){
        return galleryService.getSeeTwoGallery();
    }
    @GetMapping
    public List<Gallery> getGallery(){
      return  galleryService.getGallery();
    }
    @PatchMapping("/check")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public Gallery editGalleryCheck(@RequestBody Gallery gallery){
    return     galleryService.editGalleryCheck(gallery);
    }
    @PutMapping("/dragdrob")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public void dragDrop(@RequestParam UUID first,@RequestParam UUID last){
        galleryService.dragdrob(first,last);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public void deletePhoto(@PathVariable UUID id){
        galleryService.deleteFoto(id);
    }
}
