package com.luissilvacoding.jwt_oauth_mfa_app.controller;

import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.luissilvacoding.jwt_oauth_mfa_app.dto.ErrorResponse;
import com.luissilvacoding.jwt_oauth_mfa_app.dto.MeResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User", description = "Operations related to User")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Operation(summary = "Get current user", description = "Returns the authenticated user's profile based on the JWT subject.")
    @GetMapping("/me")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Returns logged user data ", content = @Content(mediaType = "application/json", examples = {
                    @ExampleObject(name = "User data", value = """
                                        {
                                            "id": 1,
                                            "email": "doe@example.com",
                                            "name": "John Doe",
                                            "provider": "LOCAL",
                                            "mfaEnabled": "false",
                                            "createdAt": "2026-05-14 14:42:31.892395"
                                        }
                            """)
            })),
            @ApiResponse(responseCode = "404", description = "User not found on the DB", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                        {
                          "error": "User not found"
                        }
                    """)))
    })
    public ResponseEntity<?> getMe(Authentication authentication) {
        // authentication.getName() gives you the email (the JWT subject)
        // use it to fetch the user from UserRepository and return a DTO
        String email = authentication.getName();
        return userRepository.findByEmail(email).<ResponseEntity<?>>map(user -> {
            return ResponseEntity.ok(new MeResponse(user.getId(), user.getEmail(), user.getName(), user.getProvider(),
                    user.isMfaEnabled(), user.getCreatedAt()));
        })
                .orElseGet(() -> ResponseEntity.status(404).body(new ErrorResponse("User not found")));
    }

}
