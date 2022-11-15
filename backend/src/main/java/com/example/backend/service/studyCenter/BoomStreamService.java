package com.example.backend.service.studyCenter;

import com.example.backend.dto.ApiResponse;
import com.example.backend.projection.CustomApiKey;
import com.example.backend.repository.ApiKeyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class BoomStreamService {
    final ApiKeyRepository apiKeyRepository;
    private static final Logger logger = LoggerFactory.getLogger(BoomStreamService.class);

    public BoomStreamService(ApiKeyRepository apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }

    public HashModel addUserEmail(String mediaCode, String phone) {
        String result = "";
        try {
            CustomApiKey apiKey = apiKeyRepository.getFirstByOrderByCreatedAt();
            String url = "https://boomstream.com/api/ppv/addbuyer?";
            String URL = url + "apikey=" + apiKey.getApiKey() + "&media=" + mediaCode + "&access_expire=2100-12-12" +
                    "&notification=0&code=" + apiKey.getPpvCode() + "&email=" + phone.substring(1) + "@shift.uz" + "&format=json&ver=1.1";
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<BoomstreamRes> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<BoomstreamRes> response = restTemplate.exchange(URL, HttpMethod.GET, entity, BoomstreamRes.class);
            if (response.getBody() != null) {
                String hash = response.getBody().getHash();
                if (hash == null) throw new Exception("Error boomstream " + response.getBody().getMessage());
                return new HashModel(hash, true, "");
            } else {
                logger.error("Error boomstream");
                return new HashModel(null, false, result);
            }
        } catch (Exception e) {
            logger.error("Error boomstream " + e.getMessage());
            return new HashModel(null, false, result);
        }
    }

    public ApiResponse deleteEmail(String hash) {
        String result = "";
        try {
            CustomApiKey apiKey = apiKeyRepository.getFirstByOrderByCreatedAt();
            String url = "https://boomstream.com/api/ppv/deletebuyer?";
            String URL = url + "apikey=" + apiKey.getApiKey() + "&code=" + apiKey.getPpvCode() + "&hash=" + hash + "&format=json&ver=1.1";
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<BoomstreamRes> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<BoomstreamRes> response = restTemplate.exchange(URL, HttpMethod.GET, entity, BoomstreamRes.class);
            if (response.getBody() != null) {
                String message = response.getBody().getMessage();
                String status = response.getBody().getStatus();
                if (!status.equals("Success")) throw new Exception("Error boomstream " + response.getBody().getMessage());
                return new ApiResponse( true,message );
            } else {
                logger.error("Error boomstream");
                return new ApiResponse(false, result);
            }
        } catch (Exception e) {
            logger.error("Error boomstream " + e.getMessage());
            return new ApiResponse(false, result);
        }
    }
}
