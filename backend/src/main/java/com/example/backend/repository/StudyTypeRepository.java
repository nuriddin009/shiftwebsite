package com.example.backend.repository;

import com.example.backend.entity.StudyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface StudyTypeRepository extends JpaRepository<StudyType, UUID> {


    @Query(value = "select *\n" +
            "from study_type st\n" +
            "where st.study_type ilike '%' || :search || '%'", nativeQuery = true)
    Page<StudyType> getStudyTypes(String search, Pageable pageable);


}
