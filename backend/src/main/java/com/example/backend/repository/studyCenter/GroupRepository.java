package com.example.backend.repository.studyCenter;

import com.example.backend.entity.studyCenter.Group;
import com.example.backend.projection.GroupUserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<Group, UUID> {

    @Query(value = "select cast(g.id as varchar )" +
            " as groupid , g.name as groupname," +
            "cast(u.id as varchar ) as userid from" +
            " users u inner join time_table_user ttu " +
            "on u.id = ttu.user_id inner join time_table tb on ttu.time_table_id = tb.id " +
            "inner join groups g on tb.group_id = g.id " +
            "where u.username=:username group by g.id, u.id", nativeQuery = true)
    List<GroupUserData> getGroupByUserName(String username);

    @Query(value = "select *\n" +
            "from groups g\n" +
            "where g.name ilike '%' || :search || '%'\n" +
            "  and g.is_archive is false\n" +
            "order by g.created_at desc", nativeQuery = true)
    List<Group> findAllByOrderByCreatedAtDesc(String search);

    @Query(value = "select *\n" +
            "from groups g\n" +
            "where " +
//            "g.name ilike '%' || :search || '%'\n" + "  and" +
            " g.is_archive is true\n" +
            "order by g.created_at desc", nativeQuery = true)
    List<Group> getArchived();

    @Transactional
    @Modifying
    @Query("UPDATE Group g SET g.isArchive = false WHERE g.isArchive is null")
    void changeArchive();
}
