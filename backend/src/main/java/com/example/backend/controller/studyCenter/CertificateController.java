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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/certificate")
public class CertificateController {

    private final GenerateCertificate generateCertificate;
    private final UserRepository userRepository;
    private final StudyTypeRepository studyTypeRepository;
    private final CertificateRepository certificateRepository;
    private final CertificateService certificateService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/allUsers")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/studyType")
    public void saveCertificateType(@RequestBody CertificateTypeDto typeDto) {
        StudyType studyType = new StudyType();
    }

    @PutMapping("/studyType")
    public void editCertificateType() {

    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping("/create/studyType")
    public StudyType saveStudyType(@RequestBody StudyTypeDto studyType) {
        StudyType studyType1 = new StudyType();
        studyType1.setStudyType(studyType.getStudyType());
        studyType1.setDescription("Enter the certificate description");
        return studyTypeRepository.save(studyType1);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/get/studyTypes")
    public Page<StudyType> getStudyTypes(@RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(0, 5);
        return studyTypeRepository.getStudyTypes(search, pageable);
    }

    @GetMapping("/get/{id}")
    public StudyType getStudyType(@PathVariable UUID id) {
        return studyTypeRepository.findById(id).get();
    }


    @SneakyThrows
    @GetMapping("/get/one/{id}")
    public void getOne(@PathVariable UUID id, HttpServletResponse response) {
        Optional<Certificate> byId = certificateRepository.findById(id);
        if (byId.isPresent()) {
            Certificate certificate = byId.get();
            FileCopyUtils.copy(certificate.getCertificatePhoto(), response.getOutputStream());
        } else {
            File file = new File("static/images/img.png");
            InputStream is = new FileInputStream(file);
            FileCopyUtils.copy(is, response.getOutputStream());
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PatchMapping("/edit/description")
    public StudyType editDescription(@RequestParam UUID studyTypeId, @RequestBody DescDto descDto) {
        Optional<StudyType> byId = studyTypeRepository.findById(studyTypeId);
        if (byId.isPresent()) {
            StudyType studyType = byId.get();
            studyType.setDescription(descDto.getDescription());
            return studyTypeRepository.save(studyType);
        }
        return null;
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping("/create/{userId}")
    public void createCertificateUser(
            @PathVariable UUID userId,
            @RequestBody UserCertificateDto certificateDto
    ) {
        certificateService.generateC(userId, certificateDto);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping("/users")
    public Page<UserCertificateProjection> getUsersC(
            @RequestParam Integer page,
            @RequestParam(defaultValue = "") String search
    ) {
        return certificateRepository.getAllUsersCertificate(PageRequest.of(page, 5), search);
    }

    @SneakyThrows
    @GetMapping("/qrCode/{id}")
    public void getQr(@PathVariable UUID id, HttpServletResponse response) {
        Certificate certificate = certificateRepository.findById(id).get();
        FileCopyUtils.copy(certificate.getQrCode(), response.getOutputStream());
    }

    @SneakyThrows
    @GetMapping("/image/{id}")
    public void getC(@PathVariable UUID id, HttpServletResponse response) {
        Certificate certificate = certificateRepository.findById(id).get();
        FileCopyUtils.copy(certificate.getCertificatePhoto(), response.getOutputStream());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteC(@PathVariable UUID id) {
        certificateRepository.deleteById(id);
    }


//    @SneakyThrows
//    @GetMapping("/test")
//    public void getTest(HttpServletResponse response){
//        Certificate certificate = certificateRepository.findAll().get(0);
//        FileCopyUtils.copy(certificate.getCertificatePhoto(), response.getOutputStream());
//    }

    @SneakyThrows
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable UUID id) {
        Optional<Certificate> byId = certificateRepository.findById(id);

        if (byId.isPresent()) {
            Certificate certificate = byId.get();

            Optional<User> byId1 = userRepository.findById(certificate.getUser().getId());
            User user = byId1.get();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                            + user.getFirstName() + " " + user.getLastName() + ".jpeg" + "\"")
                    .body(certificate.getCertificatePhoto());
        }
        return null;
    }

    @GetMapping("/check/{id}")
    public ApiResponse checkCertificate(@PathVariable UUID id) {
        Optional<Certificate> byId = certificateRepository.findById(id);
        if (byId.isPresent()) {
            return new ApiResponse("Certificate found", true);
        }
        return new ApiResponse("Certificate not found!", false);
    }
}
