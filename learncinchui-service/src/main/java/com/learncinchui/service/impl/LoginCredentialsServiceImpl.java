package com.learncinchui.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.learncinchui.model.LoginCredentials;
import com.learncinchui.service.LoginCredentialsService;

@Service("loginCredentialsService")
public class LoginCredentialsServiceImpl implements LoginCredentialsService {

	@Override
	public void authenticateUser(LoginCredentials loginCredentials) {

		/*System.out.println(loginCredentials.getUserName() + " : " + loginCredentials.getPassword());
		return null;*/
		
		/*HttpHeaders headers = new HttpHeaders(); 
		headers.setContentType(MediaType.APPLICATION_JSON);
		MultiValueMap<String, String> map= new LinkedMultiValueMap<String, String>();
		map.add("username", loginCredentials.getUserName());
		map.add("password", loginCredentials.getPassword());
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers); 
		RestTemplate restTemplate = new RestTemplate();
		String url = "http://localhost:8090/api/auth/login";
		//ResponseEntity<String> response = restTemplate.postForEntity( url, request , String.class );
		 restTemplate.postForObject(url, request , String.class );*/
		 MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");

	        headers.setAll(map);

	        Map req_payload = new HashMap();
	        req_payload.put("username", loginCredentials.getUserName());
	        req_payload.put("password", loginCredentials.getPassword());

	        HttpEntity<?> request = new HttpEntity<>(req_payload, headers);
	        String url =  "http://localhost:8090/api/auth/login";

	        ResponseEntity<?> response = new RestTemplate().postForEntity(url, request, String.class);
		
	}

}
