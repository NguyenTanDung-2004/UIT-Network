package com.example.UserService.user.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.UserService.exception.EnumException;
import com.example.UserService.exception.UserException;
import com.example.UserService.user.entity.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JWTService {
    @Value("${jwt.secret}")
    String secretKey;

    @Value("${jwt.expiration}")
    Long expiration;

    public String generateJWT(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        // Create the JWT claims set
        JWTClaimsSet claim = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("Study Buddy")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .claim("roleId", user.getRole().getId())
                .claim("userId", user.getId())
                .build();

        // create payload
        Payload payload = new Payload(claim.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            e.printStackTrace();
            throw new UserException(EnumException.VERIFY_TOKEN_FAIL);
        }
    }

    public Map<String, Object> decodeJWT(String token) {
        Map<String, Object> claimsMap = new HashMap<>();
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKey);

            if (signedJWT.verify(verifier)) {
                JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
                claimsMap.put("subject", claims.getSubject());
                claimsMap.put("issuer", claims.getIssuer());
                claimsMap.put("issueTime", claims.getIssueTime());
                claimsMap.put("expirationTime", claims.getExpirationTime());
                claimsMap.put("roleId", claims.getClaim("roleId"));
                claimsMap.put("userId", claims.getClaim("userId"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new UserException(EnumException.VERIFY_TOKEN_FAIL);
        }
        return claimsMap;
    }
}
