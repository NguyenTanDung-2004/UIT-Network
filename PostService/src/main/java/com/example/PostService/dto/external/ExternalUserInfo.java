package com.example.PostService.dto.external;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExternalUserInfo {
    private String userId;

    public ExternalUserInfo(Map<String, Object> map) {
        this.userId = (String) map.get("userId");
    }
}
