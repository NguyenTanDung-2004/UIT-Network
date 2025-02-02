package com.example.IdentityService.service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.example.IdentityService.exception.ExceptionCode;
import com.example.IdentityService.exception.ExceptionUser;
import com.example.IdentityService.response.ResponseCode;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

@Component
public class AuthenticationService {
    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.valid-duration}")
    private int duration;

    public String createToken() {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet claim = new JWTClaimsSet.Builder()
                .issuer("Dũng đẹp trai")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(Duration.ofSeconds(duration)).toEpochMilli()))
                .build();
        Payload payload = new Payload(claim.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            e.printStackTrace();
            throw new ExceptionUser(ExceptionCode.CreateTokenFail);
        }
    }

    public String verifyToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(this.secretKey.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            Date expireTime = (Date) signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expireTime.before(new Date())) {
                throw new ExceptionUser(ExceptionCode.VerifyTokenFail);
            } else {
                if (signedJWT.verify(verifier)) {
                    return "right";
                } else {
                    throw new ExceptionUser(ExceptionCode.VerifyTokenFail);
                }
            }
        } catch (Exception e) {
            throw new ExceptionUser(ExceptionCode.VerifyTokenFail);
        }
    }

    public JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(this.secretKey.getBytes(),
                "HS256");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    public ResponseEntity authenticate(String token) {
        String result = verifyToken(token);
        return ResponseEntity.ok().body(ResponseCode.jsonForEnum(ResponseCode.Authenticated));
    }

    public ResponseEntity generateToken() {
        Map<String, String> response = new HashMap<>();
        response.put("token", createToken());
        return ResponseEntity.ok().body(response);
    }
}
