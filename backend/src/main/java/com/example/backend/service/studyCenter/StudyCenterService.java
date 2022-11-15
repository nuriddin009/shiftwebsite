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
                        Time_table_user save = timeTableUsersRepository.save(new Time_table_user(time_table, user, timeTableUserProjection.getPrice(), 0));
                        for (int i = 0; i < (isFree ? 16 : 12); i++) {
                            Time_table_user_data time_table_user_data = new Time_table_user_data(save, i + 1, false, 0, 0, false, false, false);
                            timeTableUsersDataRepository.save(time_table_user_data);
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
        Time_table_user save = timeTableUsersRepository.save(new Time_table_user(time_table, user, data.getPrice(), 0));

        if (!time_table.getIsFree()) {
            if (timeTableUsersByTimeTableId.isEmpty()) {
                for (int i = 0; i < 12; i++) {
                    Time_table_user_data time_table_user_data = new Time_table_user_data(save, i + 1, false, 0, 0, false, false, false);
                    timeTableUsersDataRepository.save(time_table_user_data);
                }
            } else {
                for (int i = 0; i < timeTableUsersByTimeTableId.get(0).getLessonData().size(); i++) {
                    Time_table_user_data time_table_user_data = new Time_table_user_data(save, i + 1, false, 0, 0, timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getDone(), timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getExam(), false);
                    timeTableUsersDataRepository.save(time_table_user_data);
                }
            }
            return new ApiResponse("Student qo'shildi", true, null);
        }
        List<Lesson> all = lessonRepository.findAll();
        if (all.size() != 0) {
            if (timeTableUsersByTimeTableId.isEmpty()) {
                for (Lesson lesson : all) {
                    Time_table_user_data time_table_user_data = new Time_table_user_data(save, lesson.getLesson_order(), false, 0, 0, false, false, false);
                    timeTableUsersDataRepository.save(time_table_user_data);
                }
            } else {
                for (int i = 0; i < all.size(); i++) {
                    Time_table_user_data time_table_user_data = new Time_table_user_data(save, i + 1, false, 0, 0, timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getDone(), timeTableUsersByTimeTableId.get(0).getLessonData().get(i).getExam(), false);
                    timeTableUsersDataRepository.save(time_table_user_data);
                }

            }
            return new ApiResponse("The student joined free classes", true, null);
        }
        return null;

        //isFree False

    }

    public void getTimeTableUsersDataLesson(Integer id, Boolean hasinlesson) {
        Time_table_user_data time_table_user_data = timeTableUsersDataRepository.findById(id).get();
        time_table_user_data.setHasInLesson(hasinlesson);
        timeTableUsersDataRepository.save(time_table_user_data);
    }

    public void getTimeTableUsersDatalessonHomework(Integer id, Integer mark, Integer homework) {
        Time_table_user_data time_table_user_data = timeTableUsersDataRepository.findById(id).get();
        time_table_user_data.setLessonMark(mark);
        time_table_user_data.setHomeworkMark(homework);
        timeTableUsersDataRepository.save(time_table_user_data);
    }

    public void TimeTableUsersDatalessonDone(Integer lessonId, Integer timeTableId, Boolean telegramIsmessage) {
        List<Time_table_user_data> timeTableData = timeTableUsersDataRepository.findBylessonIdDone(lessonId, timeTableId);
        for (Time_table_user_data timeTableDatum : timeTableData) {
            if (timeTableDatum.getDone()) {
                timeTableDatum.setDone(false);
            } else {
                timeTableDatum.setDone(true);
                if (telegramIsmessage) {
                    if (timeTableDatum.getTime_table_user().getGotogroup() == 0) {
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
        Time_table_user time_table_user = timeTableUsersRepository.findById(id).get();
        time_table_user.setGotogroup(reqTimeTableDeleteUser.getGotogroup());
        time_table_user.setWhytogroup(reqTimeTableDeleteUser.getWhytogroup());
        time_table_user.setDeletedate(date);
        timeTableUsersRepository.save(time_table_user);
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
        List<Time_table_user_data> bylessonIdDone = timeTableUsersDataRepository.findBylessonIdDone(lessnId, timetableId);
        for (Time_table_user_data time_table_user_data : bylessonIdDone) {
            time_table_user_data.setExam(exam);
        }
        timeTableUsersDataRepository.saveAll(bylessonIdDone);
        return new ApiResponse("Imtixon boshlandi", true, null);
    }

    // this function allow to video
    public ApiResponse getTimeTableUsersDataIsvideoallowed(Integer id, Boolean isvideoallowed) {
        Time_table_user_data time_table_user_data = timeTableUsersDataRepository.findById(id).get();
        User user = time_table_user_data.getTime_table_user().getUser();
        Lesson lesson = lessonRepository.getoneLesson(time_table_user_data.getLesson_Order());
        List<Lesson_url> ListLesson = lessonUrlRepository.findLessonId(lesson.getId());

        if (ListLesson.size() == 0) {
            return new ApiResponse("Video hali tayyor emas!", false);
        }
        if (time_table_user_data.getIsvideoallowed()) {
            List<LessonHash> oneLessonHash = lessonHashRepository.findOneLessonHash(user.getId(), lesson.getId());
            if (oneLessonHash.size() != 0) {
                for (LessonHash lessonHash : oneLessonHash) {
                    lessonHashRepository.deleteById(lessonHash.getId());
                    time_table_user_data.setIsvideoallowed(isvideoallowed);
                    timeTableUsersDataRepository.save(time_table_user_data);
                }
                return new ApiResponse(true, time_table_user_data.getIsvideoallowed() ? "Video activated" : "Video deactivated");
            }

        } else {
            for (Lesson_url lesson_url : ListLesson) {
                HashModel hashModel = boomStreamService.addUserEmail(lesson_url.getUrl_video(), user.getPhoneNumber());
                if (hashModel.getSuccess()) {
                    lessonHashRepository.save(new LessonHash(null, user, lesson, hashModel.getHash(), lesson_url));
                    time_table_user_data.setIsvideoallowed(isvideoallowed);
                    timeTableUsersDataRepository.save(time_table_user_data);
                }
            }
            return new ApiResponse(true, time_table_user_data.getIsvideoallowed() ? "Video activated" : "Video deactivated");
        }
        return new ApiResponse(false, null);

    }
}
