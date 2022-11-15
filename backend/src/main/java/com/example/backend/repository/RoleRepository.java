package com.example.backend.repository;

import com.example.backend.entity.Role;
import com.example.backend.projection.RoleProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Transactional
    @Modifying
    @Query(value = "delete from users_roles ur where ur.user_id=:userId", nativeQuery = true)
    void deleteUserRoles(UUID userId);

    @Query(value = "select  array_agg(r.role_name)\n" +
            "from users u\n" +
            "         inner join users_roles ur on u.id = ur.user_id\n" +
            "         inner join role r on ur.roles_id = r.id\n" +
            "where u.id=:userId", nativeQuery = true)
    List<String> userRolesForAdmin(UUID userId);


    @Query(value = "select r.id as id , r.role_name as roleName\n" +
            "from role r\n" +
            "         inner join users_roles ur on r.id = ur.roles_id\n" +
            "where ur.user_id = :userId", nativeQuery = true)
    List<RoleProjection> getUserRoles(UUID userId);

}
