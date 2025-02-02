package com.example.APIGateway.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.APIGateway.repository.IdentityClient;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class IdentityService {
    @Autowired
    private IdentityClient identityClient;

    public Mono<ResponseEntity<Map<String, Object>>> authenticate(String token) {
        return identityClient.authenticate(token);
    }

}
