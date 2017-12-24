package com.learncinchui.service;

import com.learncinchui.model.LoginCredentials;

public interface LoginCredentialsService {

	void authenticateUser(LoginCredentials loginCredentials);
}
