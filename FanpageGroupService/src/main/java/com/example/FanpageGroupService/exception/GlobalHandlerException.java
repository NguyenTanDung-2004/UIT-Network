package com.example.FanpageGroupService.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import feign.FeignException;

@ControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(value = UserException.class)
    public ResponseEntity handleExceptionUser(UserException userException) {
        return ResponseEntity.status(userException.getEnumException().getHttpStatusCode())
                .body(EnumException.toJson(userException.getEnumException()));
    }

    @ExceptionHandler(value = ExternalException.class)
    public ResponseEntity handleExternalExceptionUser(ExternalException externalException) {
        return ResponseEntity.status(externalException.getStatusCode())
                .body(Map.of("message", externalException.getMessage(), "code", externalException.getCode()));
    }
}
