package com.example.FanpageGroupService.entities.user_group;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserGroupPK implements Serializable {
    private String userId;
    private String groupId;
}
