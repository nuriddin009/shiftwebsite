package com.example.backend.telegramBot;

import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.Time_table_user_data;
import com.example.backend.entity.telegramBot.Parent;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.telegramBot.ParentRepo;
import com.example.backend.telegramBot.QueryStep.BotSteps;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.objects.Contact;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class TelegramBot extends TelegramLongPollingBot {
    private final UserRepository userRepository;
    private final BotUtils botUtils;
    private final ParentRepo parentRepo;



    @SneakyThrows
    @Override
    public void onUpdateReceived(Update update) {

        if (update.hasMessage()) {
            Message message = update.getMessage();
            Parent parent = botUtils.getchatId(message.getChatId().toString());
            if (message.hasText()) {
                String text = message.getText();
                if (text.equals("/start")) {
                    if (parent.getPhoneNumber() != null) {

                    } else {
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setChatId(parent.getChatId());
                        sendMessage.setText("Shift Academy botidan foydalanish uchun <b>Contact yuborish</b> tugmasini bosing. (Bu jarayon faqatgina bir marta amalga oshiriladi)");
                        sendMessage.setParseMode(ParseMode.HTML);
                        sendMessage.setReplyMarkup(BotUtils.generateContactButton());
                        Message execute = execute(sendMessage);
                        botUtils.saveExecute(execute.getMessageId(), parent.getChatId());
                        botUtils.setStep(parent.getChatId(), BotSteps.SHARING_CONTACT);
                    }

                }

            } else if (message.hasContact()) {
                Contact contact = message.getContact();
                botUtils.savephone(contact, parent);
                DeleteMessage deleteMessage = botUtils.deleteBtn(parent.getChatId(), parent.getButtonId());
                execute(deleteMessage);
                botUtils.saveChatIdUser(parent);
                execute(botUtils.deleteBtn(parent.getChatId(), message.getMessageId()));
                successnewParent(parent);
                seeChild(parent);
            }

        } else if (update.hasCallbackQuery()) {

        }
    }

    private void successnewParent(Parent parent) {
        StringBuilder name = new StringBuilder("Tabriklaymiz siz muvaffaqiyat ulandingiz\n");
        for (User user : parent.getUser()) {
            name.append(user.getFirstName()).append(" ").append(user.getLastName()).append("\n");
        }
        if (parent.getUser().size() >= 1) {
            sendText(parent.getChatId(), name + "o'quvchilar bizning academiyamizda o'qishadi");
        } else {
            sendText(parent.getChatId(), name + "o'quvchi bizning academiyamizda o'qiydi");
        }
        sendText(parent.getChatId(), "O'quvchilarni kunlik baxolarini, darsga borligini xabar beruvchi bot");
    }

    private void seeChild(Parent parent) {
        List<User> allByPhoneNumber = userRepository.findAllByFatherPhoneNumber(parent.getPhoneNumber());
    }

    @SneakyThrows
    public Message sendText(String chatId, String text) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setText(text);
        sendMessage.setChatId(chatId);
        sendMessage.setParseMode(ParseMode.HTML);
        return execute(sendMessage);
    }

    @SneakyThrows
    public void messageParentTelegram(Integer lessonId, Time_table_user_data timeTableDatum) {

        Optional<Parent> parent = parentRepo.findByPhoneNumber(timeTableDatum.getTime_table_user().getUser().getFatherPhoneNumber());
        if (parent.isPresent()) {
            SendMessage sendMessage = new SendMessage();
            String text = "X";
            String fullName = "\uD83D\uDC68\u200D\uD83D\uDCBB O'quvchi: " + timeTableDatum.getTime_table_user().getUser().getFirstName() + " " + timeTableDatum.getTime_table_user().getUser().getLastName();
            if (timeTableDatum.getHasInLesson()) {
                String todayInfo;
                if (timeTableDatum.getExam() == null || timeTableDatum.getExam()) {
                    todayInfo = "\uD83D\uDCDA Xolat: " + lessonId + "-dars" +
                            (timeTableDatum.getLessonMark() == 1 || timeTableDatum.getLessonMark() == 0 ? "\nImtihondan o'tolmadi. Iltimos nazoratni qattiq oling ‼️" : "\n \uD83D\uDCD4 Imtihon bahosi= " + timeTableDatum.getLessonMark());
                } else {
                    todayInfo = "\uD83D\uDCDA Xolat: " + lessonId + "-dars" +
                            (timeTableDatum.getLessonMark() == 0 ? "" : timeTableDatum.getLessonMark() == 1 ? "\n Darga qatnashmadi ‼️" : "\n \uD83D\uDCD4 Darsga qatnashgan bahosi= " + timeTableDatum.getLessonMark()) + "\n" +
                            (timeTableDatum.getHomeworkMark() == 0 ? "" : timeTableDatum.getHomeworkMark() == 1 ? "\uD83D\uDCD3 Uyga vazifa qilinmagan. Iltimos nazoratni qattiq oling ‼️" : "\uD83D\uDCD3 Uyga vazifadagi bahosi= " + timeTableDatum.getHomeworkMark())
                    ;
                }
                text = fullName + " \n " + todayInfo;
            } else {
                if (timeTableDatum.getExam() || timeTableDatum.getExam() == null) {
                    text = fullName + "\n " + lessonId + "-Imtixonga kelmadi \uD83D\uDEAB ‼️";
                } else {
                    text = fullName + "\n " + lessonId + "-darsga kelmadi \uD83D\uDEAB ‼️";
                }
            }
            sendMessage.setText(text);
            sendMessage.setChatId(parent.get().getChatId());
            Message execute = execute(sendMessage);

            SendMessage sendMessage2 = new SendMessage();
            sendMessage2.setText(text);
            sendMessage2.setChatId("420040267");
            execute(sendMessage2);

            SendMessage sendMessage3 = new SendMessage();
            sendMessage3.setText(text);
            sendMessage3.setChatId("1718896026");
            execute(sendMessage3);
        }


    }

    // if you get project from git you must set your own bot username and token

    // 5053122492:AAGlm33_FkDAe2wJ2S-zg4Xf3VXms0pNqvE  - test

    // 5438088057:AAEtekplo9_9sR7AhG_0OfzvpHCjHchkr1U  - shift

    @Override
    public String getBotToken() {
        return "5053122492:AAGlm33_FkDAe2wJ2S-zg4Xf3VXms0pNqvE";
    }



    //  test_qilish_uchun_robot

    // uzshiftacademy_bot

    @Override
    public String getBotUsername() {
        return "test_qilish_uchun_robot";
    }


}
