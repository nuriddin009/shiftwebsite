package com.example.backend.controller.studyCenter;

import com.example.backend.dto.*;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.projection.CustomUsers;
import com.example.backend.projection.UserSearchProjection;
import com.example.backend.service.UserService;
import com.example.backend.service.UserSession;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserSession userSession;

    @DeleteMapping("/unlockUsers")
    public void unlockUser() {
        userService.unlockUser();
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


    @GetMapping("/myData")
    public ApiResponse getOneUser() {
        return userService.oneUsername(userSession.getUsername());
    }

    @GetMapping("/me/{userId}")
    public User getMe(@PathVariable UUID userId) {
        return userService.getMe(userId);
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
        return userService.getUserRoles(userId);
    }


    @GetMapping("/filePath/{username}")
    public HasIMG hasPhoto(@PathVariable String username) {
        return userService.hasPhoto(username);

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
    @PutMapping("/addPhoto")
    public ApiResponse addPhotos(@RequestParam MultipartFile file) {
        return userService.addPhotos1(userSession.getUsername(), file);
    }

    @SneakyThrows
    @GetMapping("/avatar/{userId}")
    public void getAvatar(@PathVariable UUID userId, HttpServletResponse response) {
        userService.getAvatar(userId, response);
    }

    @PutMapping("/edit_password")
    public HttpEntity<ApiResponse> editPassword(@RequestBody @Valid PasswordDetails passwordDetails) {
        return ResponseEntity.ok(userService.editPassword(userSession.getUsername(), passwordDetails));
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
        return userService.getUsernameForEdit(phone);
    }
}
