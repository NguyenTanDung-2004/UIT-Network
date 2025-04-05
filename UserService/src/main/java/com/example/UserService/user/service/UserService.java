package com.example.UserService.user.service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.UserService.exception.EnumException;
import com.example.UserService.exception.UserException;
import com.example.UserService.hobby.entity.Hobby;
import com.example.UserService.hobby.service.HobbyService;
import com.example.UserService.mapper.UserMapper;
import com.example.UserService.response.ApiResponse;
import com.example.UserService.response.EnumResponse;
import com.example.UserService.user.dto.request.RequestLogin;
import com.example.UserService.user.dto.request.RequestResetPassword;
import com.example.UserService.user.dto.request.RequestUpdateUserInfo;
import com.example.UserService.user.dto.response.ResponseExternalUserInfo;
import com.example.UserService.user.dto.response.ResponseUserInfo;
import com.example.UserService.user.entity.User;
import com.example.UserService.user.model.PrivateProperties;
import com.example.UserService.user.model.TimeSlot;
import com.example.UserService.user.repository.UserRepository;
import com.example.UserService.util.JsonConverter;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonParser;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordService passwordService;

    @Autowired
    JWTService jwtService;

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private HobbyService hobbyService;

    @Autowired
    private JsonConverter jsonConverter;

    @Value("${kafka-info.typeid}")
    private Integer typeid;

    public ResponseEntity login(RequestLogin requestLogin) {
        // find user by email
        User user = getUser(requestLogin.getEmail(), "email");
        if (user == null) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // check password
        if (passwordService.checkPassword(requestLogin.getPassword(), user.getPassword()) == 0) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // create jwt
        String jwt = jwtService.generateJWT(user);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(Map.of("jwt", jwt))
                .enumResponse(EnumResponse.toJson(EnumResponse.LOGIN_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private User getUser(String value, String columnName) {
        if (columnName.equals("email")) {
            Optional<User> user = userRepository.findByEmail(value);
            if (user.isPresent()) {
                return user.get();
            } else {
                return null;
            }
        } else if (columnName.equals("id")) {
            Optional<User> user = userRepository.findById(value);
            if (user.isPresent()) {
                return user.get();
            } else {
                return null;
            }
        }
        return null;
    }

    private User getUserFromAthorization(String authorizationHeader) {
        // Extract token from "Bearer <token>"
        String token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7)
                : authorizationHeader;

        // get userId from token
        String userId = (String) this.jwtService.decodeJWT(token).get("userId");

        // get user info
        User user = getUser(userId, "id");

        return user;
    }

    public ResponseEntity sendCodeViaEmail(String email) {
        // find user by email
        User user = getUser(email, "email");
        if (user == null) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // generate code
        String code = generateCode();

        // save to database
        user.setCode(code);
        userRepository.save(user);

        // push event to kafka
        // type:EnumNotifiType||mailType:ForgotPassword||to:" + email
        this.kafkaTemplate.send("user-notification", typeid + "||ForgotPassword||" + email + "||" + code);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.SEND_CODE_FORGOT_PASSWORD_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder("");

        // generate 6 random numbers (0 - 9)
        for (int i = 0; i < 6; i++) {
            code.append((int) (Math.random() * 10));
        }

        return code.toString();
    }

    public ResponseEntity resetPassword(RequestResetPassword requestResetPassword) {
        // find account
        User user = getUser(requestResetPassword.getEmail(), "email");
        if (user == null) {
            throw new UserException(EnumException.USER_NOT_FOUND);
        }

        // check code
        if (requestResetPassword.getCode().equals(user.getCode())) {
            // reset password
            String hashedPassword = this.passwordService.hashPassword(requestResetPassword.getNewPass());

            // save user
            user.setPassword(hashedPassword);
            this.userRepository.save(user);
        } else {
            // response code fail
            throw new UserException(EnumException.CODE_RESETPASS_WRONG);
        }

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.RESET_PASSWORD_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity getUserInfo(String authorizationHeader) {
        // Extract token from "Bearer <token>"
        String token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7)
                : authorizationHeader;

        // get user id
        String userId = (String) this.jwtService.decodeJWT(token).get("userId");

        // get user info
        User user = getUser(userId, "id");

        // convert to response
        ResponseUserInfo responseUserInfo = this.userMapper.toResponse(user, hobbyService);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(responseUserInfo)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_USERINFO_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private ResponseEntity createUserResponseEntity(User user) {
        // convert to response
        ResponseUserInfo responseUserInfo = this.userMapper.toResponse(user, hobbyService);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(responseUserInfo)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_USERINFO_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity updateUserInfo(RequestUpdateUserInfo requestUpdateUserInfo, String authorizationHeader) {
        // get user from authorization
        User user = this.getUserFromAthorization(authorizationHeader);

        // update new properties
        this.userMapper.updateBasicInfo(requestUpdateUserInfo, user);

        // save user
        user = this.userRepository.save(user);

        // convert to response
        ResponseUserInfo responseUserInfo = this.userMapper.toResponse(user, hobbyService);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(responseUserInfo)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_BASIC_USERINFO))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity updateUserHobbies(RequestUpdateUserInfo request, String authorizationHeader) {
        // get user
        User user = getUserFromAthorization(authorizationHeader);

        // get user hobby ids
        Set<Long> originalHobbyIds = this.hobbyService.getUserHobbyIds(user.getId());

        // create user hobby ids
        Set<Long> updatedHobbyIds = createUserHobbyIds(request.getHobbyIds(), originalHobbyIds);

        // save
        this.hobbyService.insertUserHobbies(user.getId(), updatedHobbyIds);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_USER_HOBBIES))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private Set<Long> createUserHobbyIds(Set<Long> updateSet, Set<Long> originalSet) {
        Set<Long> resultSet = new HashSet<>(updateSet); // Copy updateSet
        resultSet.removeAll(originalSet); // Remove elements that are in originalSet
        return resultSet;
    }

    public ResponseEntity updateSchedule(RequestUpdateUserInfo request, String authorizationHeader) {
        // get user
        User user = this.getUserFromAthorization(authorizationHeader);

        // convert to Json
        String json = jsonConverter.toJsonString(request.getJsonSchedule());

        // update data
        user.setJsonSchedule(json);

        // save
        user = this.userRepository.save(user);

        // convert to object
        Object object = jsonConverter.toObject(user.getJsonSchedule());

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(object)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_USER_HOBBIES))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public void pushEventWhenCreateUser(User user) {
        System.out.println(user.getId() + "||" + user.getName() + "||" + user.getDob() + "||"
                + user.getStudentID() + "||" + user.getMajor() + "||" + user.getFaculty() + "||" + user.getPhone());
        // id||name||dob||studentId||major||faculty||phone
        this.kafkaTemplate.send("user-creation", user.getId() + "||" + user.getName() + "||" + user.getDob() + "||"
                + user.getStudentID() + "||" + user.getMajor() + "||" + user.getFaculty() + "||" + user.getPhone());
    }

    public ResponseEntity updatePrivate(String authorizationHeader) {
        // get user
        User user = getUserFromAthorization(authorizationHeader);

        if (user.getPrivateProperties() == 1) {
            user.setPrivateProperties(0);
        } else {
            user.setPrivateProperties(1);
        }

        // save
        user = this.userRepository.save(user);

        // create response
        return createUserResponseEntity(user);
    }

    // public ResponseEntity externalGetUserInfo(String authorizationHeader) {
    // // get User
    // User user = this.getUserFromAthorization(authorizationHeader);

    // return ResponseEntity.ok(Map.of("userId", user.getId()));
    // }

    public ResponseEntity externalGetUserId(String authorizationHeader) {
        // get user
        User user = this.getUserFromAthorization(authorizationHeader);

        return ResponseEntity.ok("\"" + user.getId() + "\"");
    }

    public ResponseEntity externalGetUserInfo(String ids) {
        List<String> idList = Arrays.asList(ids.split(",")); // Convert to List

        List<User> users = this.userRepository.getListUser(idList);

        // convert to list external response info
        List<ResponseExternalUserInfo> lists = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            lists.add(this.userMapper.toResponseExternalUserInfo(users.get(i)));
        }

        return ResponseEntity.ok(lists);
    }

    public ResponseEntity externalGetUserInfoV2(String ids) {
        List<String> idList = Arrays.asList(ids.split(",")); // Convert to List
    
        List<User> users = this.userRepository.getListUser(idList);
    
        // Dynamically remove problematic fields
        users.forEach(user -> {
            try {
                // Use reflection to set the "hobbies" field to null
                java.lang.reflect.Field hobbiesField = user.getClass().getDeclaredField("hobbies");
                hobbiesField.setAccessible(true); // Make the field accessible
                hobbiesField.set(user, null); // Set the field to null
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace(); // Log the error if the field is not found or inaccessible
            }
        });
    
        return ResponseEntity.ok(users);
    }

    public ResponseEntity getUserInfoById(String userId, String authorizationHeader) throws IOException {
        // get curent user
        User currentUser = this.getUserFromAthorization(authorizationHeader);

        Object responseUserInfo = null;

        if (currentUser.getId().equals(userId) == false){
            // get user info
            User user = getUser(userId, "id");

            // convert to response
            responseUserInfo = this.userMapper.toResponse(user, hobbyService);
        }
        else{
            responseUserInfo = currentUser.toMap();
        }

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(responseUserInfo)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_USERINFO_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity getListUser(String authorizationHeader, String textSearch) {
        List<User> users = this.userRepository.searchText(textSearch);

        if (users == null) {
            users = new ArrayList<>();
        }
       
        List<Object> listResponses = new ArrayList<>();

        users.stream().forEach(user -> {
            if (user.getPrivateProperties() == 1) {
                listResponses.add(this.userMapper.toResponse(user, hobbyService));
            }
            else{
                try {
                    listResponses.add(user.toMap());
                } catch (IOException e) {
                    throw new UserException();
                }
            }
        });

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(listResponses)
                .enumResponse(EnumResponse.toJson(EnumResponse.SEARCH_USER_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
