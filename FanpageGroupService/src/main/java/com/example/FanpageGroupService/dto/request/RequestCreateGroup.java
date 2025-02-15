package com.example.FanpageGroupService.dto.request;

import java.util.Date;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestCreateGroup {
    private String name;
    private String intro;
    private String phone;
    private String email;

    private String avtURL;

    private String backgroundURL;
}
