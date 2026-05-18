package com.luissilvacoding.jwt_oauth_mfa_app.dto;

public class MfaRequiredResponse {
    private boolean mfaRequired;
    private String email;

    public MfaRequiredResponse(boolean mfaRequired, String email) {
        this.mfaRequired = mfaRequired;
        this.email = email;
    }

    public boolean isMfaRequired() {
        return mfaRequired;
    }

    public String getEmail() {
        return email;
    }
}
