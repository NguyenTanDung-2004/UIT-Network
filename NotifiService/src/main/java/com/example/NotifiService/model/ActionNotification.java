package com.example.NotifiService.model;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
    private String postid;

    @Transient
    private Map<String, Object> extrafield;

    public ActionNotification(List<String> parts){
        super(parts);
        this.createdid = parts.get(1);
        this.message = parts.get(2);
        this.date = new Date();
        this.receivedid = parts.get(3);
        
        Integer typeid = Integer.parseInt(parts.get(0));
        switch (typeid) {
            case 1:
                this.extrafield = null;
                break;
            case 2:
                this.extrafield = new HashMap<>();
                this.postid = parts.get(4);
                this.extrafield.put("postid", parts.get(4));
                break;
            default:
                this.extrafield = null;
        }
    }
}
