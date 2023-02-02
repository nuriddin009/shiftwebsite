package com.example.backend.service.studyCenter;


import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.DescDto;
import com.example.backend.dto.StudyTypeDto;
import com.example.backend.dto.UserCertificateDto;
import com.example.backend.entity.Attachment;
import com.example.backend.entity.Certificate;
import com.example.backend.entity.StudyType;
import com.example.backend.entity.User;
import com.example.backend.projection.UserCertificateProjection;
import com.example.backend.repository.StudyTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.CertificateRepository;
import com.google.common.io.ByteStreams;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CertificateService {

    private final GenerateCertificate generateCertificate;
    private final UserRepository userRepository;
    private final StudyTypeRepository studyTypeRepository;
    private final CertificateRepository certificateRepository;

    @SneakyThrows
    public void generateC(UUID userId, UserCertificateDto certificateDto) {
        User user = userRepository.findById(userId).get();

        Attachment attachment = user.getAttachment();
        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setStudyType(certificateDto.getStudyType());
        certificate.setDescription(certificateDto.getDescription());
        Certificate save = certificateRepository.save(certificate);

        InputStream fileInputStream = new FileInputStream("images/users/" + userId + ".png");
        byte[] bytes1 = ByteStreams.toByteArray(fileInputStream);

        byte[] bytes = generateCertificate.generateStudentCertificate(
                save.getId(),
                bytes1,
                user.getFirstName(),
                user.getLastName(),
                certificateDto.getStudyType(),
                certificateDto.getDescription()
        );

        FileCopyUtils.copy(
                bytes, new FileOutputStream("images/certificate/image/" + userId + ".png")
        );

        certificate.setCertificatePhoto(bytes);
        certificateRepository.save(certificate);
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public StudyType saveStudyType(StudyTypeDto studyType) {
        StudyType studyType1 = new StudyType();
        studyType1.setStudyType(studyType.getStudyType());
        studyType1.setDescription("Enter the certificate description");
        return studyTypeRepository.save(studyType1);
    }

    public Page<StudyType> getStudyTypes(String search, Pageable pageable) {
        return studyTypeRepository.getStudyTypes(search, pageable);
    }

    public StudyType getStudyType(UUID id) {
        return studyTypeRepository.getReferenceById(id);
    }

    @SneakyThrows
    public void getOne(UUID id, HttpServletResponse response) {
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

    public StudyType editDescription(UUID studyTypeId, DescDto descDto) {
        Optional<StudyType> byId = studyTypeRepository.findById(studyTypeId);
        if (byId.isPresent()) {
            StudyType studyType = byId.get();
            studyType.setDescription(descDto.getDescription());
            return studyTypeRepository.save(studyType);
        }
        return null;
    }

    public Page<UserCertificateProjection> getUsersC(PageRequest pageRequest, String search) {
        return certificateRepository.getAllUsersCertificate(pageRequest, search);

    }

    @SneakyThrows
    public void getQr(UUID id, HttpServletResponse response) {
        Certificate certificate = certificateRepository.findById(id).get();
        FileCopyUtils.copy(certificate.getQrCode(), response.getOutputStream());
    }

    @SneakyThrows
    public void getC(UUID id, HttpServletResponse response) {
        Certificate certificate = certificateRepository.findById(id).get();
        FileCopyUtils.copy(certificate.getCertificatePhoto(), response.getOutputStream());
    }

    public void deleteC(UUID id) {
        certificateRepository.deleteById(id);
    }

    public ResponseEntity<?> downloadFile(UUID id) {
        Optional<Certificate> byId = certificateRepository.findById(id);
        if (byId.isPresent()) {
            Certificate certificate = byId.get();
            User user = userRepository.getReferenceById(certificate.getUser().getId());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                            + user.getFirstName() + " " + user.getLastName() + ".jpeg" + "\"")
                    .body(certificate.getCertificatePhoto());
        }
        return null;
    }

    public ApiResponse checkCertificate(UUID id) {
        Optional<Certificate> byId = certificateRepository.findById(id);
            return new ApiResponse(byId.isPresent()?"Certificate found":"Certificate not found!", byId.isPresent());
    }
}
