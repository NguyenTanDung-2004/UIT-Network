package com.example.ChatService.dto.worksheet;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateWSChild {
    private String id;
    private String content;
    private Date fromdate;
    private Date todate;
    private String userids;
    private Integer workstatus;
    private String status;
}
