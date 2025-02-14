package com.example.PostService.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatusCode;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExternalException extends RuntimeException {
    private String code;
    private String message;
    private int statusCode;

    public ExternalException(FeignException feignException) {
        Map<String, Object> map = convertExceptionToMap(feignException);
        code = (String) map.get("code");
        message = (String) map.get("message");
        statusCode = (Integer) map.get("statusCode");
    }

    private Map<String, Object> convertExceptionToMap(FeignException e) {
        Map<String, Object> result = new HashMap<>();
        result.put("statusCode", e.status());

        String responseBody = e.contentUTF8(); // Get response as a string
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String message = jsonNode.has("message") ? jsonNode.get("message").asText() : "Unknown error";
            String code = jsonNode.has("code") ? jsonNode.get("code").asText() : "Unknown code";

            result.put("code", code);
            result.put("message", message);
        } catch (Exception jsonException) {
            throw new RuntimeException("Failed to parse error response", jsonException);
        }

        return result;
    }
}
