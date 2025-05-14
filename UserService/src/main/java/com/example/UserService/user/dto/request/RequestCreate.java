package com.example.UserService.user.dto.request;

import java.util.Date;
import java.util.Set;

import com.example.UserService.hobby.entity.Hobby;
import com.example.UserService.role.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RequestCreate {
    // general
    String email;
    String password;
    String avtURL;
    String name;

    int flagRole; // 1 - student; 2 - university; 3 - club

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
}
