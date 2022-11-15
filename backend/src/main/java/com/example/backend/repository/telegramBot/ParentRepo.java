package com.example.backend.repository.telegramBot;

import com.example.backend.entity.telegramBot.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;

public interface ParentRepo extends JpaRepository<Parent, Integer> {
    Optional<Parent> findByChatId(String chatId);

    Optional<Parent> findByPhoneNumber(String chartId);


    @Transactional
    @Modifying
    @Query(value = "delete from parent_user pu where pu.user_id=:userId", nativeQuery = true)
    void deleteUserParent(UUID userId);
}
