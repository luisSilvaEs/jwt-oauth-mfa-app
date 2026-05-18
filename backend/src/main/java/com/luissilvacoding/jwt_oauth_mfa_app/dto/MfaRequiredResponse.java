package com.luissilvacoding.jwt_oauth_mfa_app.dto;

public class MfaRequiredResponse {
    protected boolean mfaRequired;
    protected String email;

    public MfaRequiredResponse(boolean mfaRequired, String email) {
        this.mfaRequired = mfaRequired;
        this.email = email;
    }
}
