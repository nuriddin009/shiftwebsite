package com.example.backend.service.studyCenter;


import com.example.backend.dto.UserCertificateDto;
import com.example.backend.entity.Attachment;
import com.example.backend.entity.Certificate;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.CertificateRepository;
import com.google.common.io.ByteStreams;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CertificateService {

    private final UserRepository userRepository;
    private final GenerateCertificate generateCertificate;
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

}
