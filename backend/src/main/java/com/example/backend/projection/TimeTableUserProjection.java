package com.example.backend.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.UUID;

public interface TimeTableUserProjection {
    Integer getId();

    String getPrice();

    UUID getUserid();

    String getFirstname();

    String getTimatablename();

    Boolean getIsMore();

    String getLastname();

    String getPhone();

    Integer getGotogroup();

    String getGroupname();

    String getWhytogroup();

    String getDeletedate();

    Boolean getIs_free();

    @Value("#{@timeTableUsersDataRepository.getAllByTimeTableUser(target.id,target.isMore)}")
    List<LessonDataProjection> getLessonData();

    @Value("#{@timeTableUsersRepository.getParentIdFor(target.userid)}")
    List<BotConnectOrProjection> getParentsData();
}
