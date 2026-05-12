package com.luissilvacoding.jwt_oauth_mfa_app.controller;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import com.luissilvacoding.jwt_oauth_mfa_app.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
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

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = new JwtUtil();
    }

    /*
     * @RequestBody annotation:
     * - tells Spring to take the raw JSON from the HTTP request body and convert it
     * into a Java object automatically.
     * - Spring sees @RequestBody and converts that JSON into whatever type you
     * declared next to it.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");

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
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getEmail());
                    return ResponseEntity.ok().body(Map.of("token", token));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}