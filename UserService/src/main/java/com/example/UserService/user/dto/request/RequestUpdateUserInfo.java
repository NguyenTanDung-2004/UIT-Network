package com.example.UserService.user.dto.request;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.example.UserService.user.model.TimeSlot;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestUpdateUserInfo {
    String avtURL;
    String name;
    String description;
    String phone;
    Date dob;
    Double latitude;
    Double longitude;

    Set<Long> hobbyIds;

    Map<String, List<TimeSlot>> jsonSchedule;
}
