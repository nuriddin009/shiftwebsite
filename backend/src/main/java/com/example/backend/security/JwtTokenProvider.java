package com.example.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    @Value("${app.jwtSecret}")
    private String jwtSecret;
    @Value("${app.refreshJwtExpirationInMs}")
    private String refreshJwtExpirationInMs;

    @Autowired
    UserRepository userRepository;
    public String generateAccessToken(UserDetails userPrincipal) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret.getBytes());
        User user = userRepository.findByUsername(userPrincipal.getUsername()).orElseThrow(() -> new ServiceException("User not found"));
        String result = user.getRoles().stream()
                .map(n -> String.valueOf(n.getRoleName()))
                .collect(Collectors.joining(","));
        return JWT.create()
                .withSubject(userPrincipal.getUsername())
                .withClaim("roles",
                           result
                )
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String authToken) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret.getBytes());
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(authToken);
    }



    public String generateRefreshToken(String username) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret.getBytes());
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshJwtExpirationInMs))
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .sign(algorithm);
    }

//    public static DecodedJWT validateTokenHandle(String authToken) {
//        Algorithm algorithm = Algorithm.HMAC256("ShiftManagemShiftManagementDashboardSecretKeyentDashboardSecretKey".getBytes());
//        JWTVerifier verifier = JWT.require(algorithm).build();
//        return verifier.verify(authToken);
//    }


}
