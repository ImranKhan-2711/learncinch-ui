package com.learncinchui.service;

import com.learncinchui.model.LoginCredentials;

public interface LoginCredentialsService {

	LoginCredentials authenticateUser(LoginCredentials loginCredentials);
}
