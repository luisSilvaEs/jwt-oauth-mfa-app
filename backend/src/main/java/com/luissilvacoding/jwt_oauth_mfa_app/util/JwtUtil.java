package com.luissilvacoding.jwt_oauth_mfa_app.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Use @Component for any class that provides a service or utility and needs to
 * be shared across the app. However Spring also has more specific annotations
 * that are all built on top of.
 * It basically allows the utility class and methods to be availiable to use
 * for the app. Otherwise we would have to call it by creating an object
 * everytime we need it to use
 */
@Component
public class JwtUtil {

    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 hours

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}