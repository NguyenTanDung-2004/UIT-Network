package com.example.FanpageGroupService.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestUpdateFanpage {

    private String fanpageId;
    private String name;
    private String intro;
    private String phone;
    private String email;

    private String avtURL;

    private String backgroundURL;
}
