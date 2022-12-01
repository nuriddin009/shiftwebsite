package com.example.backend.controller.studyCenter;

import com.example.backend.dto.*;
import com.example.backend.entity.Certificate;
import com.example.backend.entity.StudyType;
import com.example.backend.entity.User;
import com.example.backend.projection.UserCertificateProjection;
import com.example.backend.repository.StudyTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.CertificateRepository;
import com.example.backend.service.studyCenter.CertificateService;
import com.example.backend.service.studyCenter.GenerateCertificate;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/certificate")
public class CertificateController {

    private final CertificateService certificateService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/allUsers")
    public List<User> getUsers() {
        return certificateService.getUsers();
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping("/create/studyType")
    public StudyType saveStudyType(@RequestBody StudyTypeDto studyType) {
        return certificateService.saveStudyType(studyType);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/get/studyTypes")
    public Page<StudyType> getStudyTypes(@RequestParam(defaultValue = "") String search) {
        return certificateService.getStudyTypes(search, PageRequest.of(0, 5));
    }

    @GetMapping("/get/{id}")
    public StudyType getStudyType(@PathVariable UUID id) {
        return certificateService.getStudyType(id);
    }


    @SneakyThrows
    @GetMapping("/get/one/{id}")
    public void getOne(@PathVariable UUID id, HttpServletResponse response) {
        certificateService.getOne(id, response);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PatchMapping("/edit/description")
    public StudyType editDescription(@RequestParam UUID studyTypeId, @RequestBody DescDto descDto) {
        return certificateService.editDescription(studyTypeId, descDto);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping("/create/{userId}")
    public void createCertificateUser(@PathVariable UUID userId, @RequestBody UserCertificateDto certificateDto
    ) {
        certificateService.generateC(userId, certificateDto);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/users")
    public Page<UserCertificateProjection> getUsersC(
            @RequestParam Integer page,
            @RequestParam(defaultValue = "") String search
    ) {
        return certificateService.getUsersC(PageRequest.of(page, 5), search);
    }

    @SneakyThrows
    @GetMapping("/qrCode/{id}")
    public void getQr(@PathVariable UUID id, HttpServletResponse response) {
        certificateService.getQr(id, response);
    }

    @SneakyThrows
    @GetMapping("/image/{id}")
    public void getC(@PathVariable UUID id, HttpServletResponse response) {
        certificateService.getC(id, response);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteC(@PathVariable UUID id) {
        certificateService.deleteC(id);
    }

    @SneakyThrows
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable UUID id) {
        return certificateService.downloadFile(id);
    }

    @GetMapping("/check/{id}")
    public ApiResponse checkCertificate(@PathVariable UUID id) {
        return certificateService.checkCertificate(id);
    }
}
