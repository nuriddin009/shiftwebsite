package com.example.backend.service;

import com.example.backend.entity.Attachment;
import com.example.backend.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class FileService {
    private final AttachmentRepository attachmentRepository;


    @SneakyThrows
    public UUID saveFile(MultipartFile file) {
        Attachment attachment = new Attachment();
        attachment.setFile(file.getBytes());
        Attachment save = attachmentRepository.save(attachment);
        return save.getId();
    }
}