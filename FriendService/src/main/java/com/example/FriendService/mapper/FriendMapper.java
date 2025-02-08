package com.example.FriendService.mapper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.springframework.stereotype.Component;

import com.example.FriendService.entity.User;

@Component
public class FriendMapper {
    public User messageToUser(String[] parts) {
        return User.builder()
                .id(parts[0])
                .name(parts[1])
                .dob(stringToDate(parts[2]))
                .studentId(parts[3])
                .major(parts[4])
                .faculty(parts[5])
                .phone(parts[6])
                .build();
    }

    private Date stringToDate(String dateString) {
        // Define the expected pattern
        SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);

        // Set the time zone to match the input string
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Bangkok")); // ICT = Indochina Time

        // Parse the string into a Date object
        Date date = null;
        try {
            date = sdf.parse(dateString);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return date;
    }
}
