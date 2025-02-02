package com.example.APIGateway.repository;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;
import java.util.Map;
import reactor.core.publisher.Mono;

public interface ApiGatewayClient {
    @PostExchange(url = "/user/addUserToken", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity> addToken(@RequestParam(name = "userId") String userId);

    @PostExchange(url = "/user/deleteToken", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Map<String, Object>>> deleteToken(@RequestParam(name = "userId") String userId);

    @GetExchange(url = "/user/getNumberTokens")
    Mono<ResponseEntity<Map<String, Object>>> getNumberOfToken(@RequestParam(name = "userId") String userId);
}
