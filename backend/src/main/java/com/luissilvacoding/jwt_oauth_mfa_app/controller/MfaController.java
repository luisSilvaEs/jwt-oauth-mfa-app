package com.luissilvacoding.jwt_oauth_mfa_app.controller;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import com.luissilvacoding.jwt_oauth_mfa_app.service.MfaService;
import dev.samstevens.totp.exceptions.QrGenerationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/mfa")
@Tag(name = "MFA", description = "Operations related to TOTP Multi-Factor Authentication setup and verification")
public class MfaController {

  private final MfaService mfaService;
  private final UserRepository userRepository;

  public MfaController(MfaService mfaService, UserRepository userRepository) {
    this.mfaService = mfaService;
    this.userRepository = userRepository;
  }

  // Step 1 — User requests MFA setup: generates secret and returns QR code
  @Operation(summary = "MFA Setup", description = "Generates a TOTP secret and returns a QR code URI for the authenticated user to scan with Microsoft Authenticator")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Returns the secret and QR code data URI", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
              {
                "secret": "JBSWY3DPEHPK3PXP",
                "qrCode": "data:image/png;base64,..."
              }
          """))),
      @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
              {
                "error": "User not found"
              }
          """)))
  })
  @PostMapping("/setup")
  public ResponseEntity<?> setup(@AuthenticationPrincipal String email) throws QrGenerationException {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    String secret = mfaService.generateSecret();
    String qrCodeUri = mfaService.generateQrCodeDataUri(secret, user.getEmail());

    user.setMfaSecret(secret);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of(
        "secret", secret,
        "qrCode", qrCodeUri));
  }

  // Step 2 — User scans QR code and submits their first 6-digit code to confirm
  // setup
  @Operation(summary = "Verify MFA Setup", description = "Validates the first 6-digit TOTP code after scanning the QR code. Enables MFA on the account if the code is valid.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
          {
            "code": "123456"
          }
      """)))
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "MFA enabled successfully", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
              {
                "message": "MFA enabled successfully"
              }
          """))),
      @ApiResponse(responseCode = "400", description = "Invalid code", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
              {
                "message": "Invalid code"
              }
          """)))
  })
  @PostMapping("/verify-setup")
  public ResponseEntity<?> verifySetup(@AuthenticationPrincipal String email,
      @org.springframework.web.bind.annotation.RequestBody Map<String, String> body) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    String code = body.get("code");
    boolean valid = mfaService.verifyCode(user.getMfaSecret(), code);

    if (!valid) {
      return ResponseEntity.badRequest().body(Map.of("message", "Invalid code"));
    }

    user.setMfaEnabled(true);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of("message", "MFA enabled successfully"));
  }
}