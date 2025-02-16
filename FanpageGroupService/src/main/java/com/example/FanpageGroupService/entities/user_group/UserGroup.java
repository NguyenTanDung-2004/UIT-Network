package com.example.FanpageGroupService.entities.user_group;

import java.util.Date;

import com.example.FanpageGroupService.entities.user_like_fanpage.UserFanpagePK;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_group")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(UserGroupPK.class)
public class UserGroup {
    @Id
    private String userId;
    @Id
    private String groupId;

    private Date requestedDate;

    private Boolean accepted;
}
