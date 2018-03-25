package com.learncinchui.service.impl;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
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
	public String authenticateUser(LoginCredentials loginCredentials) {
		String token = null;
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
		Map map = new HashMap<String, String>();
		map.put("Content-Type", "application/json");

		headers.setAll(map);

		Map req_payload = new HashMap();
		req_payload.put("username", loginCredentials.getUserName());
		req_payload.put("password", loginCredentials.getPassword());

		HttpEntity<?> request = new HttpEntity<>(req_payload, headers);
		String url = "http://localhost:8090/api/auth/login";

		ResponseEntity<?> response = new RestTemplate().postForEntity(url, request, String.class);
		JSONObject jsonObject;
		try {
			jsonObject = new JSONObject(response.getBody().toString());
			System.out.println(">>>>>>>>>>>>>>>token : " + toString());
			token = jsonObject.getString("token");

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return token;

	}

	@Override
	public void getList(String token) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
		Map map = new HashMap<String, String>();
		map.put("Content-Type", "application/json");
		map.put("X-Authorization", token);
		headers.setAll(map);
	 
		
		HttpEntity<?> request = new HttpEntity<>(headers);
		String url = "http://localhost:8090/api/auth/list";

		ResponseEntity<?> response = new RestTemplate().getForEntity(url, String.class);
		System.out.println(response);

	}

}
