package com.example.APIGateway.repository;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.PostExchange;

import reactor.core.publisher.Mono;

public interface UserClient {
    @PostExchange(url = "/addToCart", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<String>> addToCart();
}
