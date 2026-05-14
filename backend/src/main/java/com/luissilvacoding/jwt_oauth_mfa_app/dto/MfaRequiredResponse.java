package com.luissilvacoding.jwt_oauth_mfa_app.dto;

public class MfaRequiredResponse {
    public boolean mfaRequired;
    public String email;

    public MfaRequiredResponse(boolean mfaRequired, String email) {
        this.mfaRequired = mfaRequired;
        this.email = email;
    }
}
