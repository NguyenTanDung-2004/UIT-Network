package com.example.ChatService.dto.worksheet;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCreateWorkSheet {
   private String groupid;
   private String name;
   private Date fromdate;
   private Date todate;
   private List<WorkInSheet> worksinsheet;
}
