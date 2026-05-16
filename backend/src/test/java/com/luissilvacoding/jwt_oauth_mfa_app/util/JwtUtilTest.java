package com.luissilvacoding.jwt_oauth_mfa_app.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    void generateToken_shouldReturnNonNullToken() {
        String token = jwtUtil.generateToken("luis@example.com", "LOCAL", false);
        assertNotNull(token);
    }

    @Test
    void generateToken_shouldReturnNonEmptyToken() {
        String token = jwtUtil.generateToken("luis@example.com", "LOCAL", false);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {
        String email = "luis@example.com";
        String provider = "LOCAL";
        boolean mfaEnabled = false;
        String token = jwtUtil.generateToken(email, provider, mfaEnabled);
        assertEquals(email, jwtUtil.extractEmail(token));
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        String token = jwtUtil.generateToken("luis@example.com", "LOCAL", false);
        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void isTokenValid_shouldReturnFalseForTamperedToken() {
        String token = jwtUtil.generateToken("luis@example.com", "LOCAL", false);
        String tampered = token + "corrupted";
        assertFalse(jwtUtil.isTokenValid(tampered));
    }

    @Test
    void isTokenValid_shouldReturnFalseForEmptyToken() {
        assertFalse(jwtUtil.isTokenValid(""));
    }

    @Test
    void generateToken_differentEmailsShouldProduceDifferentTokens() {
        String token1 = jwtUtil.generateToken("luis@example.com", "LOCAL", false);
        String token2 = jwtUtil.generateToken("other@example.com", "LOCAL", false);
        assertNotEquals(token1, token2);
    }
}