package com.example.FanpageGroupService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FanpageGroupService.dto.request.RequestAcceptOrRemoveJoinGroup;
import com.example.FanpageGroupService.dto.request.RequestCreateGroup;
import com.example.FanpageGroupService.dto.request.RequestUpdateGroup;
import com.example.FanpageGroupService.entities.user_group.UserGroup;
import com.example.FanpageGroupService.entities.user_group.UserGroupPK;
import com.example.FanpageGroupService.mapper.GroupMapper;
import com.example.FanpageGroupService.repository.UserGroupRepository;
import com.example.FanpageGroupService.service.GroupService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/group")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping("")
    public ResponseEntity createGroup(@RequestBody RequestCreateGroup request,
            @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.createGroup(request, authorizationHeader);
    }

    @PutMapping("")
    public ResponseEntity updateGroup(@RequestBody RequestUpdateGroup request) {
        return groupService.updateGroup(request);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity deleteGroup(@PathVariable(name = "groupId") String groupId) {
        return groupService.deleteGroup(groupId);
    }

    @PostMapping("/{groupId}/join-request")
    public ResponseEntity requestToJoinGroup(@PathVariable(name = "groupId") String groupId,
            @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.requestToJoinGroup(groupId, authorizationHeader);
    }

    @GetMapping("/{groupId}/join-requests")
    public ResponseEntity getJoinRequests(@PathVariable(name = "groupId") String groupId) {
        return groupService.getJoinRequests(groupId);
    }

    @PostMapping("/{groupId}/join-requests")
    public ResponseEntity acceptJoinRequest(@PathVariable(name = "groupId") String groupId,
            @RequestBody RequestAcceptOrRemoveJoinGroup requestAcceptJoinGroup) {
        return groupService.acceptJoinRequest(groupId, requestAcceptJoinGroup);
    }

    @DeleteMapping("/{groupId}/join-requests")
    public ResponseEntity removeJoinRequest(@PathVariable(name = "groupId") String groupId,
            @RequestBody RequestAcceptOrRemoveJoinGroup requestAcceptJoinGroup) {
        return groupService.removeJoinRequest(groupId, requestAcceptJoinGroup);
    }

    @GetMapping("/list")
    public ResponseEntity getAllListGroup(@RequestHeader("Authorization") String authorizationHeader) {
        return groupService.getAllGroup(authorizationHeader);
    }

    @GetMapping("/notexternal/list/{userId}")
    public ResponseEntity getListGroupNotExeternal(@PathVariable(name = "userId") String userId) {
        return groupService.getListGroupNotExeternal(userId);
    }
    
    @GetMapping("/search")
    public ResponseEntity searchGroup(@RequestParam(name = "text") String text) {
        return groupService.searchGroup(text);
    }

    @GetMapping("/{groupid}")
    public ResponseEntity getGroup(@PathVariable(name = "groupid") String groupid) {
        return groupService.getGroup(groupid);
    }

    @GetMapping("/number-member/{groupid}")
    public ResponseEntity getNumberMember(@PathVariable(name = "groupid") String groupid) {
        return groupService.getNumberMember(groupid);
    }

    @GetMapping("/members/{groupid}")
    public ResponseEntity getListMember(@PathVariable(name = "groupid") String groupid) {
        return groupService.getListMember(groupid);
    }

    @GetMapping("/isadmin/{groupid}/{userid}")
    public ResponseEntity isAdmin(@PathVariable(name = "groupid") String groupid,
            @PathVariable(name = "userid") String userid) {
        return groupService.isAdmin(groupid, userid);
    }


    /*
     * External APIs
     */

    @GetMapping("/is-member/{groupId}/{userId}")
    public ResponseEntity isMember1(@PathVariable(name = "groupId") String groupId,
            @PathVariable(name = "userId") String userId) {
        return groupService.isMember1(groupId, userId);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity getListGroup(@PathVariable(name = "userId") String userId) {
        return groupService.getListGroup(userId);
    }

    @GetMapping("/list-info")
    public ResponseEntity getListGroupInfos(@RequestParam("ids") String ids) {
        System.out.println("GroupController.getListGroupInfos: ids = " + ids);
        return groupService.getListGroupInfos(ids);
    }

    @GetMapping("/is-member/{GroupId}")
    public ResponseEntity isMember(@PathVariable(name = "GroupId") String groupId,
            @RequestHeader("Authorization") String authorizationHeader) {
       return groupService.isMember(groupId, authorizationHeader);
    }
    

    /*
     * setup data
     */
    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private GroupMapper mapper;

    @PostMapping("/setup-create")
    public String postMethodName(@RequestBody List<RequestCreateGroup> entity, @RequestHeader("Authorization") String authorizationHeader) {
        for (int i = 0; i < entity.size(); i++){
            groupService.createGroup(entity.get(i), authorizationHeader);
        }
        return "0k";
    }

    @PostMapping("/setup-request-join/{groupid}")
    public String postMethodName1(@PathVariable(name = "groupid") String groupid, @RequestBody List<String> userids) {
        for (int i = 0; i < userids.size(); i++){
            // create pk usergroup
            UserGroupPK userGroupPK = createUserGroupPK(userids.get(i), groupid);

            // create usergroup
            UserGroup userGroup = new UserGroup();
            userGroup = (UserGroup) this.mapper.toEntity(userGroupPK, userGroup);

            // save
            userGroup = this.userGroupRepository.save(userGroup);
        }

        return "ok";
    }

    private UserGroupPK createUserGroupPK(String userId, String groupId) {
        return UserGroupPK.builder()
                .userId(userId)
                .groupId(groupId)
                .build();
    }
    
}
