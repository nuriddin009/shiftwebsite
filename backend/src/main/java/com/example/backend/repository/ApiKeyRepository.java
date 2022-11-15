package com.example.backend.repository;

import com.example.backend.entity.studyCenter.ApiKey;
import com.example.backend.projection.CustomApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ApiKeyRepository extends JpaRepository<ApiKey,Integer> {
    @Query(value = "select t from ApiKey t")
    CustomApiKey getFirstByOrderByCreatedAt();
}
