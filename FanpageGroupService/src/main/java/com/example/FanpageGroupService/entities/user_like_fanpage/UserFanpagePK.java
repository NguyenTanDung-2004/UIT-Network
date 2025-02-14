package com.example.FanpageGroupService.entities.user_like_fanpage;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFanpagePK implements Serializable {
    private String userId;
    private String fanpageId;
}
