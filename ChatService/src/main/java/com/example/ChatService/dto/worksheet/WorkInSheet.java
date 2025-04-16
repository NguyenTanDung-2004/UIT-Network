package com.example.ChatService.dto.worksheet;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkInSheet {
    private Date fromddate;
    private Date todate;
    private String content;
    private Integer workstatus;
    private String userids;
}
