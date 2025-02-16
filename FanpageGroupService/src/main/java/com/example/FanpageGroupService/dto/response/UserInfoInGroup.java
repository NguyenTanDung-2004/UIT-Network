package com.example.FanpageGroupService.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfoInGroup {
    private String userId;
    private String userName;
    private String avtURL;
    private Date date;
    private String studentId;
}
