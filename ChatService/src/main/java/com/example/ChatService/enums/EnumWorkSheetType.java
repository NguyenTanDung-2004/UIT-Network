package com.example.ChatService.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum EnumWorkSheetType {
    IS_PARENT(1, "Is Parent", "Is Parent"),
    IS_WORK(2, "Is Child", "Is Child"),

    DONE(3, "Done", "Completed Task"),
    PENDING(4, "Pending", "Task Pending"),
    IN_PROGRESS(5, "In Progress", "Task In Progress");
    private Integer id;
    private String value;
    private String description;
}
