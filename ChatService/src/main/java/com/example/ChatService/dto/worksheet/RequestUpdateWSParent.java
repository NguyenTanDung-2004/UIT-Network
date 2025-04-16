package com.example.ChatService.dto.worksheet;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestUpdateWSParent {
    private String id;
    private String name;
    private Date fromdate;
    private Date todate;
    private String status;
}
