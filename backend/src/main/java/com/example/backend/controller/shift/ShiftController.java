package com.example.backend.controller.shift;

import com.example.backend.dto.ReqOurTeam;
import com.example.backend.dto.ReqTD;
import com.example.backend.dto.Shift;
import com.example.backend.entity.shift.*;
import com.example.backend.service.ShiftService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/shift")
public class ShiftController {
    @Autowired
    ShiftService shiftService;

    @GetMapping
    public Shift getShift(HttpServletRequest request) {
        return shiftService.getshift(request);
    }

    @PostMapping("/saveWhyUs/{fileId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public WhyUS saveWhyUses(@PathVariable UUID fileId, @RequestBody WhyUS whyUS){
        return shiftService.saveWhyUs(fileId,whyUS);
    }
    @PostMapping("/saveCourses/{fileId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public Course saveCourses(@PathVariable UUID fileId, @RequestBody Course course){
        return shiftService.saveCourses(fileId,course);
    }
    @PostMapping("/saveOurTeam/{fileId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public OurTeam saveOurTeam(@PathVariable UUID fileId, @RequestBody OurTeam ourTeam){
        return shiftService.saveOurTeam(fileId,ourTeam);
    }
    @PostMapping("/gallery/{fileId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public Gallery saveGallery(@PathVariable UUID fileId){
        return shiftService.saveGallery(fileId);
    }
    @PutMapping("/title")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public TitleComponent editTitle(@RequestBody TitleComponent titleComponent,HttpServletRequest request) {
        return shiftService.PutTitle(titleComponent,request);
    }

    @PutMapping("/about")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public AboutComponent editAbout(@RequestBody AboutComponent aboutComponent, HttpServletRequest request) {
        return shiftService.PutAbout(aboutComponent,request);
    }
    @PutMapping("/wyhus/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public WhyUS editWhyUs(@PathVariable UUID id, @RequestBody ReqTD reqTD, HttpServletRequest request) {
     return shiftService.whyUs(id,reqTD,request);
    }
    @PutMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public Course editCourses(@PathVariable UUID id, @RequestBody ReqTD reqTD, HttpServletRequest request) {
        return shiftService.courses(id,reqTD, request);
    }


    @PutMapping("/ourTeam/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public OurTeam editOurTeam(@PathVariable UUID id, @RequestBody ReqOurTeam reqOurTeam, HttpServletRequest request) {
        return shiftService.ourTeam(id, reqOurTeam,request);
    }
    @DeleteMapping("/ourTeam/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public void deleteOurTeam(@PathVariable UUID id) {
        shiftService.deleteOurTeam(id);
    }
    @PutMapping("/address")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public Address editAddress(@RequestBody Address address, HttpServletRequest request) {
        return shiftService.address(address,request);
    }
    @PutMapping("/followUs/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public FollowUs editFollowUs(@PathVariable UUID id, @RequestBody FollowUs followUs) {
        return shiftService.followUs(id,followUs);
    }

    @CrossOrigin("*")
    @GetMapping("/file")
    public void getFileURL(@RequestParam String fileName,HttpServletResponse response) throws IOException {
        if (!fileName.equals("")) {
            FileCopyUtils.copy(new FileInputStream("frontend/src/shift/file/image/imageShift/" + fileName), response.getOutputStream());
        }
    }


    @SneakyThrows
    @PostMapping("/file/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public String editFile(@PathVariable UUID id, @RequestParam MultipartFile file){
        String type =file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        String fileName=id+ type;
        FileCopyUtils.copy(file.getInputStream(),new FileOutputStream("frontend/src/shift/file/image/imageShift/"+fileName));
        return fileName;
    }

}
