package com.example.NotifiService.model;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "action_notifications")
public class ActionNotification extends Notification{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String createdid;
    private String message;
    private Date date;
    private String receivedid;

    public ActionNotification(List<String> parts){
        super(parts);
        this.createdid = parts.get(1);
        this.message = parts.get(2);
        this.date = new Date();
        this.receivedid = parts.get(3);
        //this.extrafield = parts.get(4);
    }
}
