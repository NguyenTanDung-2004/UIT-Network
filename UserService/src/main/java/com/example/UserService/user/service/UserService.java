package com.example.UserService.user.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.UserService.exception.EnumException;
import com.example.UserService.exception.UserException;
import com.example.UserService.response.ApiResponse;
import com.example.UserService.response.EnumResponse;
import com.example.UserService.user.dto.request.RequestLogin;
import com.example.UserService.user.entity.User;
import com.example.UserService.user.repository.UserRepository;

import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordService passwordService;

    @Autowired
    JWTService jwtService;

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    public ResponseEntity login(RequestLogin requestLogin) {
        // find user by email
        User user = getUser(requestLogin.getEmail(), "email");
        if (user == null) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // check password
        String hashedPassword = passwordService.hashPassword(requestLogin.getPassword());
        if (passwordService.checkPassword(requestLogin.getPassword(), hashedPassword) == 0) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // create jwt
        String jwt = jwtService.generateJWT(user);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(Map.of("jwt", jwt))
                .enumResponse(EnumResponse.toJson(EnumResponse.LOGIN_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private User getUser(String value, String columnName) {
        if (columnName.equals("email")) {
            Optional<User> user = userRepository.findByEmail(value);
            if (user.isPresent()) {
                return user.get();
            } else {
                return null;
            }
        }
        return null;
    }

    public ResponseEntity sendCodeViaEmail(String email) {
        // find user by email
        User user = getUser(email, "email");
        if (user == null) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // push event to kafka
        // type:email||mailType:forgot-password||to:" + email
        this.kafkaTemplate.send("user-notification", "email||forgot-password||" + email);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.SEND_CODE_FORGOT_PASSWORD_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
