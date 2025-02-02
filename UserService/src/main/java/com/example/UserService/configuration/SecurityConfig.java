package com.example.UserService.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.GET).permitAll()
                .requestMatchers("/static/**").permitAll() // Allow access to static resources
                .requestMatchers(HttpMethod.POST).permitAll()
                .anyRequest().authenticated());

        // Disable CSRF protection
        httpSecurity.csrf(csrf -> csrf.disable());

        return httpSecurity.build();
    }
}
