package com.example.APIGateway.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.APIGateway.repository.UserClient;

import reactor.core.publisher.Mono;

@Service
public class UserService {
    @Autowired
    private UserClient userClient;

    // public Mono<ResponseEntity<String>> addToCart() {
    // return userClient.addToCart();
    // }
}
