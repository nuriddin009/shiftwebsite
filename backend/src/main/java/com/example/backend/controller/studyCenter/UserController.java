package com.example.backend.controller.studyCenter;

import com.example.backend.dto.*;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.projection.CustomUsers;
import com.example.backend.projection.UserSearchProjection;
import com.example.backend.repository.IpAdressUserRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.FileInputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final IpAdressUserRepository ipAdressUserRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @DeleteMapping("/unlockUsers")
    public void unlockUser() {
        ipAdressUserRepository.deleteAll();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public Page<CustomUsers> getUser(
            @RequestParam Integer page,
            @RequestParam(defaultValue = "") String input,
            @RequestParam(defaultValue = "") Boolean active,
            @RequestParam(defaultValue = "") String role
    ) {
        return userService.getUser(page, input, active, role);
    }


    @GetMapping("{username}")
    public ApiResponse getOneUser(@PathVariable String username) {
        return userService.oneUsername(username);
    }

    @GetMapping("/me/{userId}")
    public User getMe(@PathVariable UUID userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public Page<UserSearchProjection> getSearchUser(@RequestParam(defaultValue = "") String input) {
        return userService.getSearchUser(input);
    }

    @GetMapping("/me")
    public JwtAuthResponse getMe(HttpServletRequest httpServletRequest) {
        return userService.getMe(httpServletRequest);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/userRoles")
    public List<String> getUserRoles(@RequestParam("userId") UUID userId) {
        return roleRepository.userRolesForAdmin(userId);
    }


    @GetMapping("/filePath/{username}")
    public HasIMG hasPhoto(@PathVariable String username) {
        User user = userRepository.findByUsername(username).get();
        if (user.getFilePath() != null) {
            return new HasIMG(true);
        } else {
            return new HasIMG(false);
        }
    }


    @GetMapping("/myId")
    public UUID getMyId(HttpServletRequest httpServletRequest) {
        return userService.getMyId(httpServletRequest);
    }

    @GetMapping("/getoneUser/{id}")
    public ApiResponse getOneUser(@PathVariable UUID id) {
        return userService.getOneUser(id);
    }


    @GetMapping("/role")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public List<Role> getRole() {
        return userService.getRole();
    }

    @PostMapping
    public ApiResponse saveUser(@RequestBody ReqUser reqUser) {
        return userService.saveUser(reqUser);
    }


    //    SuperAdmin qilishi kerak
    @PostMapping("/role")
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN','ROLE_ADMIN')")
    public ApiResponse addRole(@RequestBody ReqRoles reqRoles) {
        return userService.addRole(reqRoles);
    }


    @PatchMapping("/editActive")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public void editActive(@RequestParam UUID id, @RequestParam Boolean activ) {
        userService.editActive(id, activ);
    }

    @PostMapping("/edit")
    public User userEdit(@RequestBody ReqUser reqUser) {
        return userService.editUser(reqUser);
    }

    @SneakyThrows
    @PutMapping("/addPhoto/{userId}")
    public ApiResponse addPhotos(@PathVariable UUID userId, @RequestParam MultipartFile file) {
        return userService.addPhotos(userId, file);
    }

    @SneakyThrows
    @PutMapping("/addphoto/{username}")
    public ApiResponse addPhotos(@PathVariable String username, @RequestParam MultipartFile file) {
        return userService.addPhotos1(username, file);
    }

    @SneakyThrows
    @GetMapping("/avatar/{userId}")
    public void getAvatar(@PathVariable UUID userId, HttpServletResponse response) {
        FileCopyUtils.copy(
                new FileInputStream("backend/images/users/" + userId + ".png"),
                response.getOutputStream()
        );
    }

    @PutMapping("/edit_password/{username}")
    public HttpEntity<ApiResponse> editPassword(@PathVariable String username, @RequestBody @Valid PasswordDetails passwordDetails) {
        return ResponseEntity.ok(userService.editPassword(username, passwordDetails));
    }

    @PutMapping("/reset-password/{username}")
    public HttpEntity<ApiResponse> resetPassword(@PathVariable String username, @RequestBody ResetPasswordDto passwordDetails) {
        return ResponseEntity.ok(userService.resetPassword(username, passwordDetails));
    }

    @PostMapping("/oneUser")
    public HttpEntity<ApiResponse> editOneUser(@RequestBody ReqUser user) {
        return ResponseEntity.ok(userService.editoneUser(user));
    }

    @GetMapping("/getUsername/{phone}")
    public ApiResponse getUsernameForEdit(@PathVariable String phone) {
        return userRepository.findByPhoneNumber(phone)
                .map(user -> new ApiResponse(user.getUsername(), true))
                .orElseGet(() -> new ApiResponse("This phone number is not registered", false));
    }

}
