package com.example.backend.controller;

import com.example.backend.entity.Attachment;
import com.example.backend.entity.User;
import com.example.backend.repository.AttachmentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileService;
import com.example.backend.service.ShiftService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/img")
public class FileController {


    private final ShiftService shiftService;
    private final FileService fileService;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public void getFile(@PathVariable UUID id, HttpServletResponse response) throws IOException {
        Optional<Attachment> byId = attachmentRepository.findById(id);
        if (byId.isPresent()) {
            FileCopyUtils.copy(byId.get().getFile(), response.getOutputStream());
        }
    }

    @PostMapping("/ourTeam/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public UUID editOutTeamImg(@PathVariable UUID id, @RequestParam MultipartFile file) throws IOException {
        return shiftService.ourTeamEditImg(id, file);
    }

    @PostMapping("/followUs/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public UUID editFollowUs(@PathVariable UUID id, @RequestParam MultipartFile file) throws IOException {
        return shiftService.followUs(id, file);

    }

//    @SneakyThrows
//    @PutMapping("/editFile/{fatherId}/home/{item}")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
//    public UUID editHomePageImages(
//            @PathVariable UUID fatherId,
//            @PathVariable String item,
//            @RequestParam MultipartFile file
//    ) {
//        String fileName = "images/home/" + item + "/" + fatherId + ".png";
//        FileCopyUtils.copy(
//                file.getInputStream(),
//                new FileOutputStream(fileName)
//        );
////        return shiftService.editFile(id, fatherId, item, file);
//        return fatherId;
//    }

    @PutMapping("/editFile/{id}/{fatherId}/{item}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public UUID editFile(@PathVariable UUID id, @PathVariable UUID fatherId, @PathVariable String item, @RequestParam MultipartFile file) {
        return shiftService.editFile(id, fatherId, item, file);
    }



    @SneakyThrows
    @GetMapping("/users/{id}")
    public void getUsersImage(@PathVariable UUID id, HttpServletResponse response) {
        FileCopyUtils.copy(
                new FileInputStream("backend/images/users/" + id + ".png"),
                response.getOutputStream()
        );
    }

    @PostMapping("/newFile")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public UUID saveFile(@RequestParam MultipartFile file) {
        return fileService.saveFile(file);
    }

    @SneakyThrows
    @PostMapping("/createProfile")
    public void createFile(@RequestParam MultipartFile file, @RequestParam UUID userId) {
//        Attachment attachment = new Attachment();
//        attachment.setFile(file.getBytes());
//        Attachment save = attachmentRepository.save(attachment);
//        Optional<User> byId = userRepository.findById(userId);
//        if (byId.isPresent()) {
//            User user = byId.get();
//            user.setAttachment(save);
//            userRepository.save(user);
//        }
//        return save.getId();

        String fileName = "backend/images/users/" + userId + ".png";
        FileCopyUtils.copy(
                file.getInputStream(),
                new FileOutputStream(fileName)
        );

        User user = userRepository.findById(userId).get();
        user.setFilePath("/backend/images/users/" + userId);
        userRepository.save(user);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public void deleteAttachment(@PathVariable UUID id) {
        attachmentRepository.deleteById(id);
    }
}
