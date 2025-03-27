package com.example.PostService.dto.external;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Ignore extra fields

public class ExternalUserInfo {
    private String userId;
    private String userName;
    private String avtURL;
    private String studentId;

    public ExternalUserInfo(Map<String, Object> map) {
        this.userId = (String) map.get("userId");
    }
}
