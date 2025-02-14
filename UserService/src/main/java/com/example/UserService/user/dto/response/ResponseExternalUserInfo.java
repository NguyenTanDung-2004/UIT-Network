package com.example.UserService.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseExternalUserInfo {
    private String userId;
    private String name;
    private String avtURL;
}
