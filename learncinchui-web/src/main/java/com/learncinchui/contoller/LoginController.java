package com.learncinchui.contoller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
	
	@RequestMapping("/")
	public ModelAndView login() {
		ModelAndView mvc = new ModelAndView("login");
		return mvc;
	}

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ModelAndView autheticate(HttpServletRequest request,HttpServletResponse response) {
		
		System.out.println("1:"+request.getAuthType());
		System.out.println("2:"+request.getContentType());
		System.out.println("4:"+request.getAuthType());
		ModelAndView mav = new ModelAndView();
		String redirectUrl = "";
		LoginCredentials loginCredentials = new LoginCredentials();
		loginCredentials.setUserName(request.getParameter("username"));
		loginCredentials.setPassword(request.getParameter("password"));
		
		String token = loginCredentialsService.authenticateUser(loginCredentials);
		System.out.println("token : "+token);
		request.getSession().setAttribute("token", "Bearer-"+token);
		redirectUrl = "redirect:/editProfile";
		
		mav.setViewName(redirectUrl);
		
		return mav;
	}
	
	@RequestMapping(value = { "/editProfile" }, method = { RequestMethod.GET })
	public ModelAndView editProfile(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("login");
		String token = (String)request.getSession().getAttribute("token");
		System.out.println(">>>>>>>>>>>>>"+token);
		loginCredentialsService.getList(token);
		return mav;
	}
	
}
