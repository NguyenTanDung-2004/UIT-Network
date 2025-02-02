package com.example.APIGateway.response;

import org.springframework.http.HttpStatus;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public enum ResponseCode {
    UNAUTHORIZED(1001, "unauthorized", HttpStatus.UNAUTHORIZED),
    TooManyRequest(1001, "Too many Request", HttpStatus.TOO_MANY_REQUESTS);

    private int code;
    private String message;
    private HttpStatus status;
}
