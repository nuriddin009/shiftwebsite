package com.example.backend.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend.dto.*;
import com.example.backend.entity.Attachment;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.projection.CustomUsers;
import com.example.backend.projection.UserProjection;
import com.example.backend.projection.UserSearchProjection;
import com.example.backend.repository.AttachmentRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

import static java.util.Arrays.stream;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttachmentRepository attachmentRepository;
    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AttachmentRepository attachmentRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.attachmentRepository = attachmentRepository;
    }

    public Page<CustomUsers> getUser(Integer page, String input, Boolean active, String role) {
        PageRequest pageRequest = PageRequest.of(page, 10);
        if (active != null) {
            return userRepository.getAllUsersForAdmin(input.toUpperCase(), active, role, pageRequest);
        }
        return userRepository.getAllUsersWithoutActive(input.toUpperCase(), role, pageRequest);
    }

    public Page<UserSearchProjection> getSearchUser(String input) {
        PageRequest pageRequest = PageRequest.of(0, 5);
        return userRepository.findAllBySearch(input.toUpperCase(),  pageRequest);
    }


    public ApiResponse saveUser(ReqUser reqUser) {
        Role role = roleRepository.findById(1).get();
        List<Role> roles = Arrays.asList(role);
        User user = new User(
                reqUser.getUsername(),
                passwordEncoder.encode(reqUser.getPassword()),
                reqUser.getFirstName(),
                reqUser.getLastName(),
                reqUser.getPhoneNumber(),
                roles,
                reqUser.getAge(),
                reqUser.getAddress(),
                reqUser.getActiv(),
                reqUser.getFatherPhoneNumber()
        );
        try {
            return new ApiResponse("success", true, userRepository.save(user));
        } catch (Exception exception) {
            return new ApiResponse(exception.getMessage().contains("constraint") ? "Telefon raqam yoki login mavjud" : "xatolik yuz berdi", false);
        }
    }


    public void editActive(UUID id, Boolean active) {
        User user = userRepository.findById(id).get();
        user.setActiv(active);
        userRepository.save(user);
    }

    public User editUser(ReqUser reqUser) {
        User user1 = userRepository.findById(reqUser.getId()).get();
        user1.setFirstName(reqUser.getFirstName());
        user1.setLastName(reqUser.getLastName());
        user1.setPhoneNumber(reqUser.getPhoneNumber());
        user1.setFatherPhoneNumber(reqUser.getFatherPhoneNumber());
        user1.setAddress(reqUser.getAddress());
        user1.setAge(reqUser.getAge());
        if (!reqUser.getPassword().isEmpty()) {
            user1.setPassword(passwordEncoder.encode(reqUser.getPassword()));
        }
        if (!reqUser.getUsername().isEmpty()) {
            user1.setUsername(reqUser.getUsername());
        }
        return userRepository.save(user1);
    }

    public List<Role> getRole() {
        return roleRepository.findAll();
    }

    public ApiResponse addRole(ReqRoles reqRoles) {
        if (reqRoles.getRoles().size() != 0) {
            User user = userRepository.findById(reqRoles.getUserId()).get();
            user.setRoles(reqRoles.getRoles());
            userRepository.save(user);
            return new ApiResponse("Userga rol qo'shildi", true);
        } else {
            return new ApiResponse("Error", false);
        }

//        Role role = roleRepository.findById(roleId).get();
//        User user = userRepository.findById(userId).get();
//        for (Role userRole : user.getRoles()) {
//            if(userRole.getRoleName()==role.getRoleName()){
//                return new  ApiResponse("Bunday rol userga mavjud",false,null);
//            }
//        }
//        user.getRoles().add(role);
//        userRepository.save(user);
//        return new  ApiResponse("Userga rol qo'shildi",true);

    }


    public ApiResponse getOneUser(UUID id) {
        Optional<User> byId = userRepository.findById(id);
        if (byId.isPresent()) {
            User user = byId.get();
            return new ApiResponse("success", true, user);
        }
        return new ApiResponse("error", false);
    }

    public ApiResponse oneUsername(String username) {
        Optional<UserProjection> userName = userRepository.getUserName(username);
        return userName.map(userProjection ->
                new ApiResponse(true, userProjection)).orElseGet(() ->
                new ApiResponse("Error", null));
    }

    public ApiResponse addPhotos(UUID userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).get();

        if (user.getAttachment() != null) {
            UUID id = user.getAttachment().getId();
            user.setAttachment(null);
            userRepository.save(user);
            attachmentRepository.deleteById(id);
        }
        Attachment attachment = new Attachment();
        attachment.setFile(file.getBytes());
        attachment.setId(user.getId());
        Attachment save = attachmentRepository.save(attachment);
        user.setAttachment(save);

        user.setFilePath("/users/" + userId);
        userRepository.save(user);
        String fileName = "images/users/" + userId + ".png";
        FileCopyUtils.copy(
                file.getInputStream(),
                new FileOutputStream(fileName)
        );

        return new ApiResponse("success add avatar", true);
    }

    public ApiResponse addPhotos1(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username).get();

        if (user.getAttachment() != null) {
            UUID id = user.getAttachment().getId();
            user.setAttachment(null);
            userRepository.save(user);
            attachmentRepository.deleteById(id);
        }
        Attachment attachment = new Attachment();
        attachment.setFile(file.getBytes());
        attachment.setId(user.getId());
        Attachment save = attachmentRepository.save(attachment);
        user.setAttachment(save);
        userRepository.save(user);
        return new ApiResponse(true, save.getId(), "success add avatar");

    }

    public ApiResponse editPassword(String username, PasswordDetails passwordDetails) {
        User user = userRepository.findByUsername(username).get();
        boolean matches = passwordEncoder.matches(passwordDetails.getOldPassword(), user.getPassword());
        if (matches) {
            if (passwordDetails.getNewPassword().equals(passwordDetails.getConfirmPassword())) {
                user.setPassword(passwordEncoder.encode(passwordDetails.getNewPassword()));
                userRepository.save(user);
                return new ApiResponse(true, "password updated");
            } else {
                return new ApiResponse(false, "non matched password");
            }
        } else {
            return new ApiResponse(false, "incorrect password");
        }
    }

    public ApiResponse resetPassword(String username, ResetPasswordDto passwordDetails) {
        User user = userRepository.findByUsername(username).get();
        user.setPassword(passwordEncoder.encode(passwordDetails.getPassword()));
        userRepository.save(user);
        return new ApiResponse(true, "password updated");
    }

    public ApiResponse editoneUser(ReqUser user) {

        Optional<User> byUsername = userRepository.findByUsername(user.getUsername());
        if (byUsername.isPresent()) {
            User userdb = byUsername.get();
            userdb.setLastName(user.getLastName());
            userdb.setFirstName(user.getFirstName());
            userdb.setAge(user.getAge());
            userdb.setPhoneNumber(user.getPhoneNumber());
            User save = userRepository.save(userdb);
            return new ApiResponse(true, "Edit profile");
        }
        return null;

    }

    public JwtAuthResponse getMe(HttpServletRequest httpServletRequest) {
        String token = httpServletRequest.getHeader("Authorization");
        DecodedJWT decodedJWT = tokenProvider.validateToken(token);
        String username = decodedJWT.getSubject();
        String[] roles = decodedJWT.getClaim("roles").asString().split(",");
        List<Role> list = new ArrayList<>();
        stream(roles).forEach(role -> list.add(new Role(list.size(), role)));
        Optional<User> byUsername = userRepository.findByUsername(username);
        if (byUsername.isPresent()) {
            User user = byUsername.get();
            if (user.getAttachment() != null) {
                return new JwtAuthResponse(list, username, user.getAttachment().getId());
            }
        }
        return new JwtAuthResponse(list, username, null);
    }


    public UUID getMyId(HttpServletRequest httpServletRequest) {
        String token = httpServletRequest.getHeader("Authorization");
        DecodedJWT decodedJWT = tokenProvider.validateToken(token);
        String username = decodedJWT.getSubject();
        Optional<User> byUsername = userRepository.findByUsername(username);
        return byUsername.map(User::getId).orElse(null);
    }
}
