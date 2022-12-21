package com.example.backend.service;

import com.example.backend.dto.ArchiveGroupDto;
import com.example.backend.entity.studyCenter.Group;
import com.example.backend.projection.GroupUserData;
import com.example.backend.repository.studyCenter.GroupRepository;
import com.example.backend.repository.studyCenter.TimeTableRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final TimeTableRepository timeTableRepository;

    public GroupService(GroupRepository groupRepository, TimeTableRepository timeTableRepository) {
        this.groupRepository = groupRepository;
        this.timeTableRepository = timeTableRepository;
    }

    public List<Group> getGroup(String search) {
        return groupRepository.findAllByOrderByCreatedAtDesc(search);
    }

    public Group saveGroup(String name) {
        Group group = new Group(name);
        //        List<Time_table> timeTableSize = timeTableRepository.findAllByGroupIdOrderByName(save.getId());
//        Time_table time_table = new Time_table(timeTableSize.size() + 1, false, save, isFree);
//        timeTableRepository.save(time_table);
        return groupRepository.save(group);
    }


    public void deleteGroup(UUID id) {
        groupRepository.deleteById(id);
    }

    public Group patchGroup(UUID id, Group group) {
        Group group1 = groupRepository.findById(id).get();
        group1.setName(group.getName());
        return groupRepository.save(group1);
    }

    public List<GroupUserData> getUserGroup(String username) {
        return groupRepository.getGroupByUserName(username);
    }

    public Group editGroupName(UUID groupId, String name) {
        Group group = groupRepository.findById(groupId).get();
        group.setName(name);
        return groupRepository.save(group);
    }

    public List<Group> getArchived() {
        return groupRepository.getArchived();
    }

    public List<Group> archiveGroup(List<ArchiveGroupDto> archiveDatas) {
        List<Group> groupList = groupRepository.findAll();
        List<Group> archiveGroups = new ArrayList<>();
        for (ArchiveGroupDto archiveData : archiveDatas) {
            Group group = groupRepository.findById(archiveData.getValue()).get();
            archiveGroups.add(group);
        }
        for (Group archiveGroup : archiveGroups) {
            archiveGroup.setIsArchive(true);
            groupRepository.save(archiveGroup);
        }
        groupList.removeAll(archiveGroups);
        for (Group group : groupList) {
            group.setIsArchive(false);
            groupRepository.save(group);
        }
        return null;
    }
}
