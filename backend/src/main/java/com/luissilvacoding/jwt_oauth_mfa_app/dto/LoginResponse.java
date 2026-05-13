package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response returned after a successful login")
public class LoginResponse {

    @Schema(description = "Signed JWT token", example = "eyJhbGciOiJIUzI1NiJ9...")
    public String token;

    public LoginResponse(String token) {
        this.token = token;
    }
}