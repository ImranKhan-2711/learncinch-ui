package com.learncinchui.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {
	public static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	@RequestMapping(value = "/login")
	public ModelAndView login() {
		ModelAndView modelAndView = new ModelAndView("login");
		return modelAndView;
	}
@PostMapping("/doLogin")
	public void doLogin() {
		HttpHeaders headers = new HttpHeaders(); 
		headers.setContentType(MediaType.APPLICATION_JSON);
		MultiValueMap<String, String> map= new LinkedMultiValueMap<String, String>();
		map.add("email", "first.last@example.com");
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers); 
		RestTemplate restTemplate = new RestTemplate();
		String url = "http://localhost:8090/api/auth/login";
		//ResponseEntity<String> response = restTemplate.postForEntity( url, request , String.class );
		 restTemplate.postForEntity( url, request , String.class );
		logger.info("************Login done**********************");
		
	}
}
