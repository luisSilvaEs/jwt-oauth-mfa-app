package com.luissilvacoding.jwt_oauth_mfa_app.handler;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import com.luissilvacoding.jwt_oauth_mfa_app.repository.UserRepository;
import com.luissilvacoding.jwt_oauth_mfa_app.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

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

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Find existing user or create a new one
        Optional<User> existing = userRepository.findByEmail(email);

        User user;
        if (existing.isPresent()) {
            user = existing.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(""); // no password for OAuth users
            userRepository.save(user);
        }

        // Issue your own JWT exactly like the regular login does
        String token = jwtUtil.generateToken(user.getEmail());

        // Redirect to frontend with the token as a query param
        response.sendRedirect("http://localhost:5173/oauth/callback?token=" + token);
    }
}