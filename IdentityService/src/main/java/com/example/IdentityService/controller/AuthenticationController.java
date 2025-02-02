package com.example.IdentityService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.IdentityService.service.AuthenticationService;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/verifyToken")
    public ResponseEntity authenticate(@RequestParam(name = "token") String token) {
        return this.authenticationService.authenticate(token);
    }

    @PostMapping("/createToken")
    public ResponseEntity createToken() {
        return this.authenticationService.generateToken();
    }

    @PostMapping("/test")
    public ResponseEntity createToken1() {
        System.out.println("test123");
        return null;
    }
}
