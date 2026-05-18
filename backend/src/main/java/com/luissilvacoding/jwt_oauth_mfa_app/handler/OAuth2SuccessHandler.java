package com.luissilvacoding.jwt_oauth_mfa_app.handler;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import com.luissilvacoding.jwt_oauth_mfa_app.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OAuth2SuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();

        // Detect provider: "google" or "github" (Spring uses lowercase registration
        // IDs)
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        String provider = registrationId.toUpperCase(); // → "GOOGLE" or "GITHUB"

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // GitHub doesn't always expose email publicly — fall back to login
        if (email == null) {
            email = oAuth2User.getAttribute("login") + "@github.com";
        }
        // GitHub may not have a display name — fall back to login username
        if (name == null) {
            name = oAuth2User.getAttribute("login");
        }

        String finalEmail = email;
        String finalName = name;

        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(finalEmail);
                    u.setName(finalName);
                    u.setProvider(provider); // ← "GOOGLE" or "GITHUB"
                    u.setPassword(""); // no password for OAuth users
                    return userRepository.save(u);
                });

        String token = jwtUtil.generateToken(user.getEmail(), user.getProvider(), user.isMfaEnabled());

        response.sendRedirect("http://localhost:5173/oauth/callback?token=" + token);
    }
}