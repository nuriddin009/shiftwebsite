package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ReqTeableUser;
import com.example.backend.dto.ReqTimeTable;
import com.example.backend.dto.ReqTimeTableDeleteUser;
import com.example.backend.entity.studyCenter.*;
import com.example.backend.entity.User;
import com.example.backend.projection.TimeTableUserDemoProjection;
import com.example.backend.projection.TimeTableUserProjection;
import com.example.backend.repository.LessonRepository;
import com.example.backend.repository.LessonUrlRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.studyCenter.*;
import com.example.backend.telegramBot.TelegramBot;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class StudyCenterService {
    private final GroupRepository groupRepository;
    private final TimeTableRepository timeTableRepository;
    private final TimeTableUsersRepository timeTableUsersRepository;
    private final TimeTableUsersDataRepository timeTableUsersDataRepository;
    private final UserRepository userRepository;
    private final TelegramBot telegramBot;
    private final LessonRepository lessonRepository;
    private final LessonHashRepository lessonHashRepository;
    private final BoomStreamService boomStreamService;
    private final LessonUrlRepository lessonUrlRepository;

    public List<Time_table> getTimeTable(UUID groupId) {
        return timeTableRepository.findAllByGroupIdOrderByName(groupId);
    }

    public List<TimeTableUserProjection> getTimeTableUsers(Integer timeTableid) {
        return timeTableUsersRepository.getTimeTableUsersByTimeTableId(timeTableid);
    }

    public Time_table saveTimeTable(UUID groupId, String timeTableName, Boolean isFree) {
        Optional<Group> byId = groupRepository.findById(groupId);
        if (byId.isPresent()) {
            List<Time_table> allByGroupIdOrderByName1 = timeTableRepository.findAllByGroupIdOrderByName(groupId);
            List<Time_table> allByGroupIdOrderByName = timeTableRepository.findAllByGroupIdOrderByName(groupId);
            Time_table time_table = timeTableRepository.save(new Time_table(allByGroupIdOrderByName.size() + 1, false, byId.get(), isFree, timeTableName));
            if (allByGroupIdOrderByName1.size() != 0) {
                Integer id = allByGroupIdOrderByName1.get(allByGroupIdOrderByName1.size() - 1).getId();
                List<TimeTableUserDemoProjection> timeTableUsersByTimeTableId = timeTableUsersRepository.getTimeTableUsersByTimeTableId1(id);

                for (TimeTableUserDemoProjection timeTableUserProjection : timeTableUsersByTimeTableId) {
                    if (timeTableUserProjection.getGotogroup() == 0) {
                        User user = userRepository.findById(timeTableUserProjection.getUserid()).get();
                        TimeTableUser save = timeTableUsersRepository.save(new TimeTableUser(time_table, user, timeTableUserProjection.getPrice(), 0));
                        for (int i = 0; i < 12; i++) {
                            TimeTableUserData timeTableUserData = new TimeTableUserData(save, i + 1, false, 0, 0, false, false, false);
                            timeTableUsersDataRepository.save(timeTableUserData);
                        }
                    }
                }
            }
            return time_table;
        }
        return null;
    }

    public ApiResponse saveTimeTableUsers(ReqTeableUser data) {
        Time_table time_table = timeTableRepository.findById(data.getTimetableId()).get();
        User user = userRepository.findById(data.getUserid()).get();
        List<TimeTableUserDemoProjection> timeTableUsersByTimeTableId = timeTableUsersRepository.getTimeTableUsersByTimeTableId1(data.getTimetableId());
        if (!timeTableUsersByTimeTableId.isEmpty()) {
            for (TimeTableUserDemoProjection timeTableUserProjection : timeTableUsersByTimeTableId) {
                if (timeTableUserProjection.getUserid().equals(data.getUserid())) {
                    return new ApiResponse("Bu student guruhda bor", false);
                }
            }
        }
        TimeTableUser save = timeTableUsersRepository.save(new TimeTableUser(time_table, user, data.getPrice(), 0));

        if (!time_table.getIsFree()) {
            if (timeTableUsersByTimeTableId.isEmpty()) {
                for (int i = 0; i < 12; i++) {
                    TimeTableUserData timeTableUserData = new TimeTableUserData(save, i + 1, false, 0, 0, false, false, false);
                    timeTableUsersDataRepository.save(timeTableUserData);
                }
            } else {
                for (int i = 0; i < timeTableUsersByTimeTableId.get(0).getLessonData().size(); i++) {
                    TimeTableUserData timeTableUserData = new TimeTableUserData(
                            save, i + 1, false, 0, 0,
                            timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getDone(),
                            timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getExam(), false);
                    timeTableUsersDataRepository.save(timeTableUserData);
                }
            }
            return new ApiResponse("Student qo'shildi", true, null);
        }
        List<Lesson> all = lessonRepository.findAll();
        if (all.size() != 0) {
            if (timeTableUsersByTimeTableId.isEmpty()) {
                for (Lesson lesson : all) {
                    TimeTableUserData timeTableUserData = new TimeTableUserData(save,
                            lesson.getLesson_order(), false, 0, 0,
                            false, false, false);
                    timeTableUsersDataRepository.save(timeTableUserData);
                }
            } else {
                for (int i = 0; i < all.size(); i++) {
                    TimeTableUserData timeTableUserData = new TimeTableUserData(save, i + 1, false, 0, 0, timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getDone(), timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getExam(), false);
                    timeTableUsersDataRepository.save(timeTableUserData);
                }

            }
            return new ApiResponse("The student joined free classes", true, null);
        }
        return null;

        //isFree False

    }

    public void getTimeTableUsersDataLesson(Integer id, Boolean hasinlesson) {
        TimeTableUserData timeTableUserData = timeTableUsersDataRepository.findById(id).get();
        timeTableUserData.setHasInLesson(hasinlesson);
        timeTableUsersDataRepository.save(timeTableUserData);
    }

    public void getTimeTableUsersDatalessonHomework(Integer id, Integer mark, Integer homework) {
        TimeTableUserData timeTableUserData = timeTableUsersDataRepository.findById(id).get();
        timeTableUserData.setLessonMark(mark);
        timeTableUserData.setHomeworkMark(homework);
        timeTableUsersDataRepository.save(timeTableUserData);
    }

    public void TimeTableUsersDatalessonDone(Integer lessonId, Integer timeTableId, Boolean telegramIsmessage) {
        List<TimeTableUserData> timeTableData = timeTableUsersDataRepository.findBylessonIdDone(lessonId, timeTableId);
        for (TimeTableUserData timeTableDatum : timeTableData) {
            if (timeTableDatum.getDone()) {
                timeTableDatum.setDone(false);
            } else {
                timeTableDatum.setDone(true);
                if (telegramIsmessage) {
                    if (timeTableDatum.getTime_tableUser().getGotogroup() == 0) {
                        telegramBot.messageParentTelegram(lessonId, timeTableDatum);
                    }
                }
            }
        }
        timeTableUsersDataRepository.saveAll(timeTableData);
    }

    public Time_table editTimeTable(Integer tableId, ReqTimeTable reqTimeTable) {
        Time_table time_table = timeTableRepository.findById(tableId).get();
        time_table.setEndDate(reqTimeTable.getEndDate());
        time_table.setStartDate(reqTimeTable.getStartDate());
        time_table.setPrice(reqTimeTable.getPrice());
        time_table.setIsStart(true);

        return timeTableRepository.save(time_table);
    }

    public ApiResponse TimeTableDeleteUser(Integer id, UUID userId, ReqTimeTableDeleteUser reqTimeTableDeleteUser) {
        LocalDate date = LocalDate.now();
        TimeTableUser time_tableUser = timeTableUsersRepository.findById(id).get();
        time_tableUser.setGotogroup(reqTimeTableDeleteUser.getGotogroup());
        time_tableUser.setWhytogroup(reqTimeTableDeleteUser.getWhytogroup());
        time_tableUser.setDeletedate(date);
        timeTableUsersRepository.save(time_tableUser);
        lessonHashRepository.deleteByUserId(userId);
        return new ApiResponse("Student guruhdan haydaldi", true, null);
    }

    public Page<TimeTableUserProjection> TimeTableGetDeleteUser(Integer page, String fullname, String stardate, String enddate) {
        PageRequest pageRequest = PageRequest.of(page, 10);
        LocalDate start = LocalDate.parse(stardate);
        LocalDate end = LocalDate.parse(enddate);
        return timeTableUsersRepository.getDeleteUserTimetable(start, end, fullname, pageRequest);

    }

    public ApiResponse exam(Boolean exam, Integer lessnId, Integer timetableId) {
        List<TimeTableUserData> bylessonIdDone = timeTableUsersDataRepository.findBylessonIdDone(lessnId, timetableId);
        for (TimeTableUserData timeTableUserData : bylessonIdDone) {
            timeTableUserData.setExam(exam);
        }
        timeTableUsersDataRepository.saveAll(bylessonIdDone);
        return new ApiResponse("Imtixon boshlandi", true, null);
    }

    // this function allow to video
    public ApiResponse getTimeTableUsersDataIsvideoallowed(Integer id, Boolean isvideoallowed) {
        TimeTableUserData timeTableUserData = timeTableUsersDataRepository.findById(id).get();
        User user = timeTableUserData.getTime_tableUser().getUser();
        Lesson lesson = lessonRepository.getoneLesson(timeTableUserData.getLesson_Order());
        List<Lesson_url> ListLesson = lessonUrlRepository.findLessonId(lesson.getId());

        if (ListLesson.size() == 0) {
            return new ApiResponse("Video hali tayyor emas!", false);
        }
        if (timeTableUserData.getIsvideoallowed()) {
            List<LessonHash> oneLessonHash = lessonHashRepository.findOneLessonHash(user.getId(), lesson.getId());
            if (oneLessonHash.size() != 0) {
                for (LessonHash lessonHash : oneLessonHash) {
                    lessonHashRepository.deleteById(lessonHash.getId());
                    timeTableUserData.setIsvideoallowed(isvideoallowed);
                    timeTableUsersDataRepository.save(timeTableUserData);
                }
                return new ApiResponse(true, timeTableUserData.getIsvideoallowed() ? "Video activated" : "Video deactivated");
            }

        }
        else {
            for (Lesson_url lesson_url : ListLesson) {
                HashModel hashModel = boomStreamService.addUserEmail(lesson_url.getUrl_video(), user.getPhoneNumber());
                if (hashModel.getSuccess()) {
                    lessonHashRepository.save(new LessonHash(null, user, lesson, hashModel.getHash(), lesson_url));
                    timeTableUserData.setIsvideoallowed(isvideoallowed);
                    timeTableUsersDataRepository.save(timeTableUserData);
                }
            }
            return new ApiResponse(true, timeTableUserData.getIsvideoallowed() ? "Video activated" : "Video deactivated");
        }
        return new ApiResponse(false, null);

    }

    public Time_table lessOrMore(Integer timeTableId, Boolean isMore) {
        Time_table time_table = timeTableRepository.findById(timeTableId).get();
        time_table.setIsMore(isMore);
        return timeTableRepository.save(time_table);
    }

    public Time_table editTimeTableName(Integer timeTableId, String timeTableName) {
        Time_table time_table = timeTableRepository.findById(timeTableId).get();
        time_table.setTableName(timeTableName);
        return timeTableRepository.save(time_table);
    }

    public void deleteTTUD(Integer id) {
        timeTableUsersDataRepository.deleteErrorTTUD(id);
    }
}
