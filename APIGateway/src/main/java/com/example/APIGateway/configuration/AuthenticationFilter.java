package com.example.APIGateway.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ReactiveHttpOutputMessage;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;

import com.example.APIGateway.response.ApiResponse;
import com.example.APIGateway.response.ResponseCode;
import com.example.APIGateway.service.UserService;
import com.example.APIGateway.service.IdentityService;
import com.example.APIGateway.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Autowired
    private UserService userService;

    private String[] publicEndPoints = { "/identity/auth/verifyToken",
            "/identity/auth/createToken" };

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.api-prefix}")
    private String apiPrefix;

    @Autowired
    private IdentityService identityService;

    @Override
    public int getOrder() {
        return -1;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // // check public point
        // if (isPublicEndPoints(exchange.getRequest())) {
        // return chain.filter(exchange);
        // }

        // // Get token from authorization header
        // List<String> authHeader =
        // exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        // if (CollectionUtils.isEmpty(authHeader)) {
        // System.out.println("Request is destroyed.");
        // return unauthenticated(exchange.getResponse());
        // }

        // String token = authHeader.get(0).replace("Bearer ", "");
        // // send token to identity service to check.
        // return identityService.authenticate(token).flatMap(authenticationResponse ->
        // {
        // if ((Integer) authenticationResponse.getBody().get("Code") == 1000) {
        // // if the token is right, check number token in bucket.
        // return userService.checkToken("4567").flatMap(numberOfTokenResponse -> {
        // System.out.println(numberOfTokenResponse.getBody());
        // if ((Integer) numberOfTokenResponse.getBody().get("Code") == 1000) {
        // // Continue processing the request and return the response
        // userService.deleteToken("4567");
        // return this.cartService.addToCart().flatMap(cartServiceResponse -> {
        // System.out.println(cartServiceResponse.getBody());
        // return chain.filter(exchange);
        // }).onErrorResume(throwable -> {
        // // Handle errors during the userService call
        // System.out.println("Error getting number of tokens: " +
        // throwable.getMessage());
        // return unauthenticated(exchange.getResponse());
        // });
        // } else {
        // System.out.println(ResponseCode.TooManyRequest);
        // return tooManyRequest(exchange.getResponse());
        // }
        // }).onErrorResume(throwable -> {
        // // Handle errors during the userService call
        // System.out.println("Error getting number of tokens: " +
        // throwable.getMessage());
        // return unauthenticated(exchange.getResponse());
        // });
        // } else
        // return unauthenticated(exchange.getResponse());
        // }).onErrorResume(throwable -> {
        // System.err.println("Error during authentication: " + throwable.getMessage());
        // return unauthenticated(exchange.getResponse());
        // });

        return chain.filter(exchange);
    }

    private boolean isPublicEndPoints(org.springframework.http.server.reactive.ServerHttpRequest serverHttpRequest) {
        // iterate through publicEndPoints to check.
        for (int i = 0; i < publicEndPoints.length; i++) {
            if (serverHttpRequest.getURI().getPath().equals(apiPrefix + publicEndPoints[i])) {
                return true;
            }
        }
        return false;
    }

    // handle unauthenticated
    Mono<Void> unauthenticated(org.springframework.http.server.reactive.ServerHttpResponse response) {
        // create response for unauthorized
        ApiResponse apiResponse = ApiResponse.builder()
                .responseCode(ResponseCode.UNAUTHORIZED)
                .build();

        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return response.writeWith(
                Mono.just(((ReactiveHttpOutputMessage) response).bufferFactory().wrap(body.getBytes())));
    }

    // handle unauthenticated
    Mono<Void> tooManyRequest(org.springframework.http.server.reactive.ServerHttpResponse response) {
        // create response for unauthorized
        ApiResponse apiResponse = ApiResponse.builder()
                .responseCode(ResponseCode.TooManyRequest)
                .build();

        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return response.writeWith(
                Mono.just(((ReactiveHttpOutputMessage) response).bufferFactory().wrap(body.getBytes())));
    }

}
