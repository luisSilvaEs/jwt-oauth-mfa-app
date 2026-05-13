package com.luissilvacoding.jwt_oauth_mfa_app.controller;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import com.luissilvacoding.jwt_oauth_mfa_app.service.MfaService;
import dev.samstevens.totp.exceptions.QrGenerationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/mfa")
public class MfaController {

    private final MfaService mfaService;
    private final UserRepository userRepository;

    public MfaController(MfaService mfaService, UserRepository userRepository) {
        this.mfaService = mfaService;
        this.userRepository = userRepository;
    }

    // Step 1 — User requests MFA setup: generates secret and returns QR code
    @PostMapping("/setup")
    public ResponseEntity<?> setup(@AuthenticationPrincipal UserDetails userDetails) throws QrGenerationException {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String secret = mfaService.generateSecret();
        String qrCodeUri = mfaService.generateQrCodeDataUri(secret, user.getEmail());

        // Save the secret but don't enable MFA yet — user must verify first
        user.setMfaSecret(secret);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "secret", secret,
                "qrCode", qrCodeUri));
    }

    // Step 2 — User scans QR code and submits their first 6-digit code to confirm
    // setup
    @PostMapping("/verify-setup")
    public ResponseEntity<?> verifySetup(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code = body.get("code");
        boolean valid = mfaService.verifyCode(user.getMfaSecret(), code);

        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid code"));
        }

        // Code confirmed — now officially enable MFA for this user
        user.setMfaEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "MFA enabled successfully"));
    }
}