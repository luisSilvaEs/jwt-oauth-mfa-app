package com.luissilvacoding.jwt_oauth_mfa_app.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("JWT OAuth MFA API")
                        .version("1.0.0")
                        .description("Authentication API with JWT, OAuth2 and MFA support")
                        .contact(new Contact()
                                .name("Your Name")
                                .email("you@example.com")));
    }
}