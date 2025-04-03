package com.example.NotifiService.dto.response;

import java.sql.Date;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class User {
    String id;

    // general
    String email;
    String password;
    String avtURL;
    String name;
    String code;


    // university

    // club
    String description;

    // student
    String studentID;
    String major;
    String faculty;
    String phone;
    Date dob;
    Long latitude;
    Long longitude;
    String jsonSchedule;
}

