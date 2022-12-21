package com.example.backend.telegramBot;

import com.example.backend.entity.User;
import com.example.backend.entity.studyCenter.TimeTableUserData;
import com.example.backend.entity.telegramBot.Parent;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.telegramBot.ParentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.objects.Contact;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BotUtils {

    private final UserRepository userRepository;
    private final ParentRepo parentRepo;

    @Autowired
    public BotUtils(UserRepository userRepository, ParentRepo parentRepo) {
        this.userRepository = userRepository;
        this.parentRepo = parentRepo;
    }

    public static ReplyKeyboardMarkup generateContactButton() {

        ReplyKeyboardMarkup replyKeyboardMarkup = new ReplyKeyboardMarkup();
        List<KeyboardRow> rows = new ArrayList<>();

        KeyboardRow row = new KeyboardRow();
        KeyboardButton button = new KeyboardButton();
        button.setText("Contact yuborish \uD83D\uDCDE");
        button.setRequestContact(true);
        row.add(button);
        rows.add(row);

        replyKeyboardMarkup.setKeyboard(rows);
        replyKeyboardMarkup.setResizeKeyboard(true);
        return replyKeyboardMarkup;
    }


    public Parent getchatId(String chatId) {
        Optional<User> byChartId = userRepository.findByChartId(chatId);

        return parentRepo.findByChatId(chatId)
                .orElseGet(() -> parentRepo.save(new Parent(chatId)));
    }

    public void setStep(String chartId, String sharingContact) {
        Parent parent = parentRepo.findByChatId(chartId).get();
        parent.setStep(sharingContact);
        parentRepo.save(parent);
    }

    public void saveExecute(Integer messageId, String chatId) {
        Parent parent1 = parentRepo.findByChatId(chatId).get();
        parent1.setButtonId(messageId);
        parentRepo.save(parent1);
    }

    public void savephone(Contact contact, Parent parent) {
        if (contact.getPhoneNumber().charAt(0) == '+') {
            parent.setPhoneNumber(contact.getPhoneNumber());
        } else {
            parent.setPhoneNumber("+" + contact.getPhoneNumber());
        }
        parentRepo.save(parent);
    }

    public DeleteMessage deleteBtn(String chatId, Integer buttonId) {
        return new DeleteMessage(chatId, buttonId);
    }

    public void saveChatIdUser(Parent parent) {
        List<User> users = userRepository.findAllByFatherPhoneNumber(parent.getPhoneNumber());
        parent.setUser(users);
        parentRepo.save(parent);
    }

    public SendMessage sendMessageToStudents(TimeTableUserData timeTableDatum) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
        List<InlineKeyboardButton> row1 = new ArrayList<>();
        List<InlineKeyboardButton> row2 = new ArrayList<>();
        InlineKeyboardButton zero = new InlineKeyboardButton();
        zero.setText("0");
        zero.setCallbackData("0");
        InlineKeyboardButton one = new InlineKeyboardButton();
        one.setText("1");
        one.setCallbackData("1");
        InlineKeyboardButton two = new InlineKeyboardButton();
        two.setText("2");
        two.setCallbackData("2");
        InlineKeyboardButton three = new InlineKeyboardButton();
        three.setText("3");
        three.setCallbackData("3");
        InlineKeyboardButton four = new InlineKeyboardButton();
        four.setText("4");
        four.setCallbackData("4");
        InlineKeyboardButton five = new InlineKeyboardButton();
        five.setText("5");
        five.setCallbackData("5");
        row1.add(zero);
        row1.add(one);
        row1.add(two);
        row2.add(three);
        row2.add(four);
        row2.add(five);
        rows.add(row1);
        rows.add(row2);
        inlineKeyboardMarkup.setKeyboard(rows);


        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(timeTableDatum.getTime_tableUser().getUser().getChartId());
        sendMessage.setText("O'qituvchini qay darajada dars o'tganini baholang");
        sendMessage.setReplyMarkup(inlineKeyboardMarkup);
        return sendMessage;
    }

}
