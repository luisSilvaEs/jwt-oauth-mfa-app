package com.luissilvacoding.jwt_oauth_mfa_app.controller;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import com.luissilvacoding.jwt_oauth_mfa_app.service.MfaService;
import com.luissilvacoding.jwt_oauth_mfa_app.util.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.luissilvacoding.jwt_oauth_mfa_app.dto.ErrorResponse;
import com.luissilvacoding.jwt_oauth_mfa_app.dto.LoginRequest;
import com.luissilvacoding.jwt_oauth_mfa_app.dto.LoginResponse;
import com.luissilvacoding.jwt_oauth_mfa_app.dto.RegisterRequest;
import com.luissilvacoding.jwt_oauth_mfa_app.dto.MfaRequiredResponse;
import com.luissilvacoding.jwt_oauth_mfa_app.dto.MfaLoginRequest;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "JWT Auth", description = "Operations related to JWT auth")
public class AuthController {
    /*
     * 'final' use:
     * - If a field is set in the constructor and never needs to change, make it
     * final.
     * 
     * Means the reference can't point to a different object.
     */
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MfaService mfaService;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, MfaService mfaService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
        this.mfaService = mfaService;
    }

    /*
     * @RequestBody annotation:
     * - tells Spring to take the raw JSON from the HTTP request body and convert it
     * into a Java object automatically.
     * - Spring sees @RequestBody and converts that JSON into whatever type you
     * declared next to it.
     */

    @Operation(summary = "Register", description = "Checks if the email exists, hashes the password with BCrypt, and saves the user")
    @RequestBody(required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterRequest.class)))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User registered successfully", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "\"User registered successfully\""))),
            @ApiResponse(responseCode = "400", description = "Email already in use", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "\"Email already in use\"")))
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@org.springframework.web.bind.annotation.RequestBody RegisterRequest body) {
        String email = body.email;
        String password = body.password;
        String name = body.name;

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // never store plain text
        user.setName(name);

        // Save to DB and return 200
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    /**
     * <?> called a 'wildcard generic'
     * - ResponseEntity<?> means "a ResponseEntity that can contain any type inside.
     * - The <> is Java's generics syntax (similar to TypeScript's <T>), and ? means
     * "I don't know or care what type this will be at compile time."
     * 
     */
    @Operation(summary = "Login", description = "Looks up the user by email and verifies the password, returns a signed JWT token on success")
    @RequestBody(required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginRequest.class)))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Returns a signed JWT token", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {
                          "token": "eyJhbGciOiJIUzI1NiJ9..."
                        }
                    """))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {
                          "error": "Invalid credentials"
                        }
                    """)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@org.springframework.web.bind.annotation.RequestBody LoginRequest body) {
        String email = body.email;
        String password = body.password;

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .<ResponseEntity<?>>map(user -> {
                    if (user.isMfaEnabled()) {
                        return ResponseEntity.ok(new MfaRequiredResponse(true, user.getEmail()));
                    }
                    String token = jwtUtil.generateToken(user.getEmail());
                    return ResponseEntity.ok(new LoginResponse(token));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(new ErrorResponse("Invalid credentials")));
    }

    @Operation(summary = "MFA Login", description = "Verifies the 6-digit TOTP code after a successful login with MFA enabled. Returns a signed JWT token on success.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = MfaLoginRequest.class)))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Returns a signed JWT token", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {
                          "token": "eyJhbGciOiJIUzI1NiJ9..."
                        }
                    """))),
            @ApiResponse(responseCode = "401", description = "Invalid MFA code", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {
                          "error": "Invalid MFA code"
                        }
                    """))),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {
                          "error": "User not found"
                        }
                    """)))
    })
    @PostMapping("/mfa-login")
    public ResponseEntity<?> mfaLogin(@org.springframework.web.bind.annotation.RequestBody MfaLoginRequest body) {
        return userRepository.findByEmail(body.email)
                .<ResponseEntity<?>>map(user -> {
                    if (!mfaService.verifyCode(user.getMfaSecret(), body.code)) {
                        return ResponseEntity.status(401).body(new ErrorResponse("Invalid MFA code"));
                    }
                    String token = jwtUtil.generateToken(user.getEmail());
                    return ResponseEntity.ok(new LoginResponse(token));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(new ErrorResponse("User not found")));
    }
}