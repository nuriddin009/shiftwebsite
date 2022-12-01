package com.example.backend.controller.shift;

import com.example.backend.config.SecurityConfig;
import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.JwtAuthResponse;
import com.example.backend.dto.ReqLogin;
import com.example.backend.dto.ReqUser;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.AuthService;
import com.example.backend.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class ResController {

    private final SecurityConfig securityConfig;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;


    @Value("${spring.jwt.secret.key}")
    private String secretKey;

    @Autowired
    private ShiftService shiftService;


    @PostMapping("/api/login")
    public HttpEntity<JwtAuthResponse> loginService(@RequestBody ReqLogin reqLogin,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response
    ) throws Exception {


//
//        Authentication authenticate = securityConfig.authenticationManagerBean().authenticate(
//                new UsernamePasswordAuthenticationToken(reqLogin.getUsername(), reqLogin.getPassword())
//        );
//        SecurityContextHolder.getContext().setAuthentication(authenticate);
//        User user = (User) authenticate.getPrincipal();
//        StringBuilder rolesStr = new StringBuilder();
//        for (Role role : user.getRoles()) {
//            rolesStr.append(role.getRoleName()).append(",");
//        }
//        String token = Jwts.builder()
//                .setSubject(user.getUsername())
//                .claim("roles", rolesStr)
//                .signWith(SignatureAlgorithm.HS256,secretKey)
//                .compact();
//        return new TokenUser(token,user.getRoles());
        return ResponseEntity.ok(shiftService.signIn(reqLogin, request));
    }

    @PostMapping("/api/signUp")
    public User saveUser(@RequestBody ReqUser reqUser) {
        Role role = roleRepository.findById(1).get();
        User user = new User(reqUser.getUsername(),
                passwordEncoder.encode(reqUser.getPassword()),
                Arrays.asList(role), reqUser.getAge(), reqUser.getAddress());
        return userRepository.save(user);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/api/deleteUser")
    public void deleteUser(@RequestParam UUID userId) {
        shiftService.deleteUser(userId);
    }


    @PostMapping("token/refresh")
    public HttpEntity<ApiResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(shiftService.refreshToken(request, response));
    }
}
