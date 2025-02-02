package com.example.APIGateway.repository;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.PostExchange;

import com.example.APIGateway.response.ApiResponse;

import reactor.core.publisher.Mono;

public interface IdentityClient {
    @PostExchange(url = "/auth/verifyToken", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Map<String, Object>>> authenticate(@RequestParam(name = "token") String token);
}
