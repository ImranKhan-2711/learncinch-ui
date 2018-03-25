package com.learncinchui.service;

import com.learncinchui.model.LoginCredentials;

public interface LoginCredentialsService {

	String authenticateUser(LoginCredentials loginCredentials);
	
	void getList(String token);
}
