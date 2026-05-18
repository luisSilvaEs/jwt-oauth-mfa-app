package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for logging in")
public class LoginRequest {

    @Schema(description = "User's email address", example = "luis@example.com")
    private String email;

    @Schema(description = "User's password", example = "123456")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}