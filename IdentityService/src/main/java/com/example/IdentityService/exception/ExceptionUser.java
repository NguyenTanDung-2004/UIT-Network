package com.example.IdentityService.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionUser extends RuntimeException {
    private ExceptionCode exceptionCode;
}
