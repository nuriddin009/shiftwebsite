package com.example.backend.repository;

import com.example.backend.entity.User;
import com.example.backend.projection.CustomUsers;
import com.example.backend.projection.UserProjection;
import com.example.backend.projection.UserSearchProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query(value = "select  u from User u where u.username=:username")
    Optional<UserProjection> getUserName(String username);


    @Query(value = "select cast(u.id as varchar) as id,\n" +
            "       u.username            as username,\n" +
            "       u.address             as address,\n" +
            "       u.phone_number        as phoneNumber,\n" +
            "       u.age                 as age,\n" +
            "       u.first_name          as firstName,\n" +
            "       u.last_name           as lastName,\n" +
            "       u.activ               as activ,\n" +
            "       u.father_phone_number as fatherPhoneNumber\n" +
            "from users u\n" +
            "         inner join users_roles ur\n" +
            "                    on u.id = ur.user_id\n" +
            "         inner join role r on ur.roles_id = r.id\n" +
            "where r.role_name ilike '%' || :filterRole || '%'\n" +
            "  and upper(concat(u.first_name, u.last_name)) like '%' || :search || '%'\n" +
            "group by u.id, u.username, u.address, u.phone_number, u.age, u.first_name, u.last_name, u.activ, u.father_phone_number,\n" +
            "         u.created_at\n" +
            "order by u.created_at desc", nativeQuery = true)
    Page<CustomUsers> getAllUsersWithoutActive(String search, String filterRole, Pageable pageable);

    @Query(value = "SELECT u from User u  " +
            "where upper(concat(u.firstName,u.lastName)) like '%'||:input||'%' order by u.createdAt desc")
    Page<UserSearchProjection> findAllBySearch(String input, Pageable pageable);


    @Query(value = "select cast(u.id as varchar) as id,\n" +
            "       u.username            as username,\n" +
            "       u.address             as address,\n" +
            "       u.phone_number        as phoneNumber,\n" +
            "       u.age                 as age,\n" +
            "       u.first_name          as firstName,\n" +
            "       u.last_name           as lastName,\n" +
            "       u.activ               as activ,\n" +
            "       u.father_phone_number as fatherPhoneNumber\n" +
            "from users u\n" +
            "         inner join users_roles ur\n" +
            "                    on u.id = ur.user_id\n" +
            "         inner join role r on ur.roles_id = r.id\n" +
            "where r.role_name ilike '%' || :filterRole || '%'\n" +
            "  and u.activ = :active\n" +
            "  and upper(concat(u.first_name, u.last_name)) like '%' || :search || '%'\n" +
            "group by u.id, u.username, u.address, u.phone_number, u.age, u.first_name, u.last_name, u.activ, u.father_phone_number,\n" +
            "         u.created_at\n" +
            "order by u.created_at desc\n", nativeQuery = true)
    Page<CustomUsers> getAllUsersForAdmin(String search, Boolean active, String filterRole, PageRequest pageRequest);


    //BotTelegram

    List<User> findAllByFatherPhoneNumber(String phone);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.balance=0 WHERE u.balance is null ")
    void changeBalance();
}
