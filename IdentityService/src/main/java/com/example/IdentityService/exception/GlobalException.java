package com.example.IdentityService.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = ExceptionUser.class)
    public ResponseEntity handleExceptionUser(ExceptionUser exceptionUser) {
        return ResponseEntity.status(exceptionUser.getExceptionCode().getStatus())
                .body(ExceptionCode.jsonForEnum(ExceptionCode.CreateTokenFail));
    }
}
