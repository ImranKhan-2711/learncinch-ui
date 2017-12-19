package com.learncinchui.service.impl;

import org.springframework.stereotype.Service;

import com.learncinchui.model.LoginCredentials;
import com.learncinchui.service.LoginCredentialsService;

@Service("loginCredentialsService")
public class LoginCredentialsServiceImpl implements LoginCredentialsService {

	@Override
	public LoginCredentials authenticateUser(LoginCredentials loginCredentials) {

		System.out.println(loginCredentials.getUserName() + " : " + loginCredentials.getPassword());
		return null;
	}

}
