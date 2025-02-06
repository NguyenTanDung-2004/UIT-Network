package com.example.UserService.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.UserService.user.dto.request.RequestCreate;
import com.example.UserService.user.dto.request.RequestLogin;
import com.example.UserService.user.dto.request.RequestResetPassword;
import com.example.UserService.user.entity.User;
import com.example.UserService.user.mapper.UserMapper;
import com.example.UserService.user.repository.UserRepository;
import com.example.UserService.user.service.UserService;

import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/user")
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserController {
    @Autowired
    UserMapper userMapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping("/create")
    public ResponseEntity createUser(@RequestBody List<RequestCreate> listRequestCreate) {
        for (int i = 0; i < listRequestCreate.size(); i++) {
            // convert to user
            User user = userMapper.toEntity(listRequestCreate.get(i));

            // save
            userRepository.save(user);
        }

        return ResponseEntity.ok("ok");
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody RequestLogin requestLogin) {
        return userService.login(requestLogin);
    }

    @GetMapping("/send-code-via-email")
    public ResponseEntity sendCodeViaEmail(@RequestParam String email) {
        return userService.sendCodeViaEmail(email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity resetPassword(@RequestBody RequestResetPassword requestResetPassword) {
        return userService.resetPassword(requestResetPassword);
    }
}
