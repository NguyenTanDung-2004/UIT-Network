package com.example.UserService.user.dto.response;

import java.util.Date;
import java.util.Set;

import com.example.UserService.hobby.entity.Hobby;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResponseUserInfo {
    String id;

    // general
    String email;
    String avtURL;
    String name;

    // university

    // club
    String description;

    // student
    String studentID;
    String major;
    String faculty;
    String phone;
    Date dob;
    Double latitude;
    Double longitude;
    String jsonSchedule;
    String background;

    Set<Hobby> hobbies;
}
