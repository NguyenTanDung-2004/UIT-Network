package com.example.UserService.user.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
/*
 * 1 is private
 * 0 is public
 */
public class PrivateProperties {
    int email;
    int name;
    int phone;
    int dob;
}
