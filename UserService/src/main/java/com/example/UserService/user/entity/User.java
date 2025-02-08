package com.example.UserService.user.entity;

import java.io.IOException;
import java.util.Date;
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
    Long latitude;
    Long longitude;
    @Column(columnDefinition = "JSON") // Define JSON column
    String jsonSchedule;

    @ManyToMany
    @JoinTable(name = "user_hobby", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "hobby_id"))
    Set<Hobby> hobbies;
}
