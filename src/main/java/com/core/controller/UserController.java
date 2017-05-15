package com.core.controller;

import com.core.domain.User;
import com.core.security.SecuritySupport;
import com.core.security.annotation.RightCheck;
import com.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

/**
 * Created by sun
 */
@Controller
@RequestMapping("/admin")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @ResponseBody
    @RequestMapping(value = "/userUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userUpdateAH(User user) throws Exception {
        return userService.updateInfo(user).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/userChangePassWord", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userChangePassWordAH(User user) throws Exception {
        return userService.changePassWord(user).toString();
    }
}
