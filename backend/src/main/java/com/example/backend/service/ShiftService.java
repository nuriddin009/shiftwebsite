package com.example.backend.service;

import com.example.backend.config.SecurityConfig;
import com.example.backend.dto.*;
import com.example.backend.entity.Attachment;

import com.example.backend.entity.User;
import com.example.backend.entity.UserIpAdress;
import com.example.backend.entity.studyCenter.Time_table_user;
import com.example.backend.repository.AttachmentRepository;
import com.example.backend.entity.shift.*;
import com.example.backend.repository.IpAdressUserRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.shiftRepo.*;
import com.example.backend.repository.studyCenter.LessonHashRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersDataRepository;
import com.example.backend.repository.studyCenter.TimeTableUsersRepository;
import com.example.backend.repository.telegramBot.ParentRepo;
import com.example.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShiftService {

    private final AboutRepo aboutRepo;
    private final AddressRepo addressRepo;
    private final CourseRepo courseRepo;
    private final FollowUsRepo followUsRepo;
    private final GalleryRepo galleryRepo;
    private final OurTeamRepo ourTeamRepo;
    private final TitleRepo titleRepo;
    private final WhyUsRepo whyUsRepo;
    private final AttachmentRepository attachmentRepository;
    private final LessonHashRepository lessonHashRepository;
    private final TimeTableUsersRepository timeTableUsersRepository;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;
    private final UserRepository userRepository;
    private final ParentRepo parentRepo;
    private final RoleRepository roleRepository;


    public Shift getshift(HttpServletRequest request) {
        String lang = request.getHeader("lang");
        List<FollowUs> allByOrderByName = followUsRepo.findAllByOrderByName();
        return new Shift(
                aboutRepo.findAll().get(0),
                titleRepo.findAll().get(0),
                whyUsRepo.findAllByOrderByCreatedAtDesc(),
                courseRepo.findAllByOrderByCreatedAtDesc(),
                galleryRepo.findAll(),
                ourTeamRepo.findAllByOrderByCreatedAtDesc(),
                addressRepo.findAll().get(0),
                allByOrderByName
        );
    }

    public TitleComponent PutTitle(TitleComponent titleComponent, HttpServletRequest request) {
        String lang = request.getHeader("lang");
        TitleComponent title = titleRepo.findAll().get(0);
        if (lang.equals("ENG") || lang.equals("null")) {
            title.setTitle(titleComponent.getTitle());
            title.setDescription(titleComponent.getDescription());
        } else if (lang.equals("UZB")) {
            title.setTitle_UZB(titleComponent.getTitle());
            title.setDescription_UZB(titleComponent.getDescription());
        } else if (lang.equals("RUS")) {
            title.setTitle_RUS(titleComponent.getTitle());
            title.setDescription_RUS(titleComponent.getDescription());
        }
        return titleRepo.save(title);
    }

    public AboutComponent PutAbout(AboutComponent aboutComponent, HttpServletRequest request) {
        String lang = request.getHeader("lang");
        AboutComponent about = aboutRepo.findAll().get(0);

        if (lang.equals("ENG") || lang.equals("null")) {
            about.setTitle(aboutComponent.getTitle());
            about.setDescription(aboutComponent.getDescription());
        } else if (lang.equals("UZB")) {
            about.setDescription_UZB(aboutComponent.getDescription());
            about.setTitle_UZB(aboutComponent.getTitle());
        } else if (lang.equals("RUS")) {
            about.setTitle_RUS(aboutComponent.getTitle());
            about.setDescription_RUS(aboutComponent.getDescription());
        }
        return aboutRepo.save(about);
    }

    public WhyUS whyUs(UUID id, ReqTD reqTD, HttpServletRequest request) {
        String lang = request.getHeader("lang");
        Optional<WhyUS> byId = whyUsRepo.findById(id);
        if (byId.isPresent()) {
            WhyUS whyUS = byId.get();
            if (lang.equals("ENG") || lang.equals("null")) {
                whyUS.setTitle(reqTD.getTitle());
                whyUS.setDescription(reqTD.getDescription());
            } else if (lang.equals("UZB")) {
                whyUS.setTitle_UZB(reqTD.getTitle());
                whyUS.setDescription_UZB(reqTD.getDescription());
            } else if (lang.equals("RUS")) {
                whyUS.setTitle_RUS(reqTD.getTitle());
                whyUS.setDescription_RUS(reqTD.getDescription());
            }
            return whyUsRepo.save(whyUS);
        }
        return null;
    }

    public Course courses(UUID id, ReqTD reqTD, HttpServletRequest request) {
        String lang = request.getHeader("lang");
        Optional<Course> byId = courseRepo.findById(id);
        if (byId.isPresent()) {
            Course course = byId.get();
            if (lang.equals("ENG") || lang.equals("null")) {
                course.setTitle(reqTD.getTitle());
                course.setDescription(reqTD.getDescription());
            } else if (lang.equals("UZB")) {
                course.setTitle_UZB(reqTD.getTitle());
                course.setDescription_UZB(reqTD.getDescription());
            } else if (lang.equals("RUS")) {
                course.setTitle_RUS(reqTD.getTitle());
                course.setDescription_RUS(reqTD.getDescription());
            }
            return courseRepo.save(course);
        }
        return null;
    }

    public OurTeam ourTeam(UUID id, ReqOurTeam reqOurTeam, HttpServletRequest request) {
        String lang = request.getHeader("lang");
        Optional<OurTeam> byId = ourTeamRepo.findById(id);
        if (byId.isPresent()) {
            OurTeam ourTeam = byId.get();
            if (lang.equals("ENG") || lang.equals("null")) {
                ourTeam.setName(reqOurTeam.getName());
                ourTeam.setDescription(reqOurTeam.getDescription());
            } else if (lang.equals("UZB")) {
                ourTeam.setName(reqOurTeam.getName());
                ourTeam.setDescription_UZB(reqOurTeam.getDescription());
            } else if (lang.equals("RUS")) {
                ourTeam.setName(reqOurTeam.getName());
                ourTeam.setDescription_RUS(reqOurTeam.getDescription());
            }
            return ourTeamRepo.save(ourTeam);

        }

//        Team.setDescription(ourTeam.getDescription());
//        Team.setName(ourTeam.getName());
//        return ourTeamRepo.save(Team);
        return null;
    }

    public Gallery gallery(Gallery gallery) {
        return galleryRepo.save(gallery);
    }

    public Address address(Address address, HttpServletRequest request) {
        String lang = request.getHeader("lang");
        Address address1 = addressRepo.findAll().get(0);
        if (lang.equals("ENG") || lang.equals("null")) {
            address1.setAddress(address.getAddress());
        } else if (lang.equals("UZB")) {
            address1.setAddress_UZB(address.getAddress());
        } else if (lang.equals("RUS")) {
            address1.setAddress_RUS(address.getAddress());
        }
        address1.setNumber(address.getNumber());
        return addressRepo.save(address1);
    }

    public FollowUs followUs(UUID id, FollowUs followUs) {
        FollowUs followUs1 = followUsRepo.findById(id).get();
        followUs1.setURL(followUs.getURL());
        followUs1.setImgURL(followUs.getImgURL());
        return followUsRepo.save(followUs1);
    }


    public UUID ourTeamEditImg(UUID id, MultipartFile file) throws IOException {
        OurTeam ourTeam = ourTeamRepo.findById(id).get();
        Attachment attachment = new Attachment();
        attachment.setFile(file.getBytes());
        attachment.setId(ourTeam.getId());
        Attachment save = attachmentRepository.save(attachment);
        ourTeam.setAttachment(save);
        ourTeamRepo.save(ourTeam);
        return save.getId();
    }

    public UUID followUs(UUID id, MultipartFile file) throws IOException {
        FollowUs followUs = followUsRepo.findById(id).get();
        Attachment attachment = new Attachment();
        attachment.setFile(file.getBytes());
        attachment.setId(followUs.getId());
        Attachment save = attachmentRepository.save(attachment);
        followUs.setAttachment(save);
        followUsRepo.save(followUs);
        return save.getId();
    }


    @SneakyThrows
    public UUID editFile(UUID id, UUID fatherId, String item, MultipartFile file) {
        Attachment attachment1 = new Attachment();
        attachment1.setFile(file.getBytes());
        Attachment save = attachmentRepository.save(attachment1);
        if (item.equals("gallery")) {
            Gallery gallery = galleryRepo.findById(fatherId).get();
            gallery.setAttachment(save);
            galleryRepo.save(gallery);
        }
        else if (item.equals("whyUs")) {
            WhyUS whyUS = whyUsRepo.findById(fatherId).get();
            whyUS.setAttachment(save);
            whyUsRepo.save(whyUS);
        }
        else if (item.equals("courses")) {
            Course course = courseRepo.findById(fatherId).get();
            course.setAttachment(save);
            courseRepo.save(course);
        } else if (item.equals("ourteam")) {
            OurTeam ourTeam = ourTeamRepo.findById(fatherId).get();
            ourTeam.setAttachment(save);
            ourTeamRepo.save(ourTeam);
        }
        if (!id.equals("b0f85a63-3c0b-4abd-9867-cc355d02c741")) {
            attachmentRepository.deleteById(id);
        }
        return save.getId();
    }

    public WhyUS saveWhyUs(UUID fileId, WhyUS whyUS) {
        Attachment attachment = attachmentRepository.findById(fileId).get();
        WhyUS whyUS1 = new WhyUS(whyUS.getTitle(), whyUS.getDescription(), whyUS.getTitle_UZB(), whyUS.getTitle_RUS(), whyUS.getDescription_UZB(), whyUS.getDescription_RUS(), attachment);
        return whyUsRepo.save(whyUS1);
    }

    public Course saveCourses(UUID fileId, Course course) {
        Attachment attachment = attachmentRepository.findById(fileId).get();
        Course course1 = new Course(course.getTitle(), course.getDescription(), course.getTitle_UZB(), course.getTitle_RUS(), course.getDescription_UZB(), course.getDescription_RUS(), attachment);
        return courseRepo.save(course1);
    }

    public OurTeam saveOurTeam(UUID fileId, OurTeam ourTeam) {
        Attachment attachment = attachmentRepository.findById(fileId).get();
        OurTeam ourTeam1 = new OurTeam(ourTeam.getName(), ourTeam.getDescription(), ourTeam.getName_UZB(), ourTeam.getName_RUS(), ourTeam.getDescription_UZB(), ourTeam.getDescription_RUS(), attachment);
        return ourTeamRepo.save(ourTeam1);
    }

    public Gallery saveGallery(UUID fileId) {
        Attachment attachment = attachmentRepository.findById(fileId).get();
        Gallery gallery = new Gallery(attachment);
        gallery.setSee(true);
        Gallery save = galleryRepo.save(gallery);
        return save;
    }

    public void deleteOurTeam(UUID id) {
        ourTeamRepo.deleteById(id);
    }


    private final SecurityConfig securityConfig;
    private final JwtTokenProvider jwtTokenProvider;
    private final IpAdressUserRepository ipAdressUserRepository;

    public JwtAuthResponse signIn(ReqLogin reqLogin, HttpServletRequest request) throws Exception {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        User user = null;
        Optional<UserIpAdress> byIpAdress = ipAdressUserRepository.findByIpAdress(ipAddress);
        if (byIpAdress.isPresent()) {
            UserIpAdress userIpAdress = byIpAdress.get();
            if (userIpAdress.getCount() >= 5) {
                return new JwtAuthResponse(false, "Your account was blocked");
            }
        }

        try {
            Authentication authentication = securityConfig
                    .authenticationManagerBean()
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    reqLogin.getUsername(), reqLogin.getPassword())
                    );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
            user = (User) authentication.getPrincipal();
            System.out.println(user);
            String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
            if (byIpAdress.isPresent()) {
                byIpAdress.get().setCount(0);
                byIpAdress.get().setUser(user);
                ipAdressUserRepository.save(byIpAdress.get());
            }

            return new JwtAuthResponse(true, accessToken, user.getRoles(), user.getUsername());

        } catch (Exception exception) {
            if (byIpAdress.isPresent()) {
                byIpAdress.get().setCount(byIpAdress.get().getCount() + 1);
                ipAdressUserRepository.save(byIpAdress.get());
            } else {
                ipAdressUserRepository.save(new UserIpAdress(ipAddress, 0, user));
            }
            return new JwtAuthResponse(false, "Login yoki parol xato!");
        }
    }

    @Modifying
    @Transactional
    public void deleteUser(UUID userId) {
        lessonHashRepository.deleteLessonHashUserId(userId);
        List<Time_table_user> byUserId = timeTableUsersRepository.findByUserId(userId);
        if (byUserId.size() != 0) {
            for (Time_table_user time_table_user : byUserId) {
                timeTableUsersDataRepository.deleteTTUDBYUser(time_table_user.getId());
            }
        }
        timeTableUsersRepository.deleteByUserId(userId);
        parentRepo.deleteUserParent(userId);
        roleRepository.deleteUserRoles(userId);
        userRepository.deleteById(userId);
    }
}
