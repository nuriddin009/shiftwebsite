package com.example.backend.controller.studyCenter;

import com.example.backend.entity.studyCenter.Group;
import com.example.backend.projection.GroupUserData;
import com.example.backend.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/group")
public class GroupController {


    private final GroupService groupService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public List<Group> getGroup(@RequestParam(defaultValue = "") String search) {
        return groupService.getGroup(search);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    @PatchMapping("/edit/{groupId}/{name}")
    public Group editGroup(@PathVariable UUID groupId, @PathVariable String name) {
        return groupService.editGroupName(groupId, name);
    }

    @GetMapping("{username}")
    public List<GroupUserData> getUserGroup(@PathVariable String username) {
        return groupService.getUserGroup(username);
    }

    @PostMapping("{name}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public Group saveGroup(@PathVariable String name) {
        return groupService.saveGroup(name);
    }

    @PatchMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public Group patchGroup(@RequestParam UUID id, @RequestBody Group group) {
        return groupService.patchGroup(id, group);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MENTOR','ROLE_SUPERADMIN')")
    public void deleteGroup(@PathVariable UUID id) {
        groupService.deleteGroup(id);
    }
}
