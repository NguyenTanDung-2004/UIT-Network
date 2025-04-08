package com.example.UserService.user.entity;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.example.UserService.hobby.entity.Hobby;
import com.example.UserService.role.entity.Role;
import com.example.UserService.user.model.TimeSlot;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    // general
    String email;
    String password;
    String avtURL;
    String name;
    String code;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // university

    // club
    String description;

    // student
    String studentID;
    String major;
    String faculty;
    String phone;
    Date dob;
    Double latitude;
    Double longitude;
    @Column(columnDefinition = "JSON") // Define JSON column
    String jsonSchedule;

    @Column(columnDefinition = "INT DEFAULT 0")
    Integer privateProperties = 0; // 1 is private || 0 is public

    @ManyToMany
    @JoinTable(name = "user_hobby", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "hobby_id"))
    Set<Hobby> hobbies;

    public Map<String, Object> toMap() throws IOException {
        Map<String, Object> map = new HashMap<>();
    
        if (this.id != null) map.put("id", this.id);
        if (this.email != null) map.put("email", this.email);
        if (this.name != null) map.put("name", this.name);
        if (this.avtURL != null) map.put("avtURL", this.avtURL);
        if (this.description != null) map.put("description", this.description);
        if (this.studentID != null) map.put("studentID", this.studentID);
        if (this.major != null) map.put("major", this.major);
        if (this.faculty != null) map.put("faculty", this.faculty);
        if (this.phone != null) map.put("phone", this.phone);
        if (this.dob != null) map.put("dob", this.dob);
        if (this.latitude != null) map.put("latitude", this.latitude);
        if (this.longitude != null) map.put("longitude", this.longitude);
        if (this.privateProperties != null) map.put("privateProperties", this.privateProperties);    
        return map;
    }
}
