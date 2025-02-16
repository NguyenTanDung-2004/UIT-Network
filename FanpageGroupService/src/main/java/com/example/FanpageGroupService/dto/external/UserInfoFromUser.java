package com.example.FanpageGroupService.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfoFromUser {
    private String userId;
    private String userName;
    private String avtURL;
    private String studentId;
}
