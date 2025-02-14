package com.example.FanpageGroupService.entities.user_like_fanpage;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_like_fanpage")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@IdClass(UserFanpagePK.class)
public class UserLikeFanpage {
    @Id
    private String userId;

    @Id
    private String fanpageId;
}
