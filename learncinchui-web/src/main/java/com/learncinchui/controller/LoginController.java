package com.learncinchui.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.learncinchui.model.LoginCredentials;
import com.learncinchui.service.LoginCredentialsService;

@RestController
public class LoginController {

	@Autowired
	LoginCredentialsService loginCredentialsService;
	
	@RequestMapping(value = "/login")
	public ModelAndView login() {
		ModelAndView modelAndView = new ModelAndView("login");
		return modelAndView;
	}

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ModelAndView autheticate(HttpServletRequest request) {
		LoginCredentials loginCredentials = new LoginCredentials();
		loginCredentials.setUserName(request.getParameter("username"));
		loginCredentials.setPassword(request.getParameter("password"));
		LoginCredentials loginCredentials2 = loginCredentialsService.authenticateUser(loginCredentials);
		ModelAndView mvc = new ModelAndView("login");
		return mvc;
	}
}
