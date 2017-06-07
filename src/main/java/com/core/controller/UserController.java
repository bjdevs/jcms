package com.core.controller;

import com.core.domain.User;
import com.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
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

    @ResponseBody
    @RequestMapping(value = "/userAdd", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userAddAH(User user) throws Exception {
        return userService.createAccount(user).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/accountList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void userTypeShow(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(userService.getList(request));
    }

    @ResponseBody
    @RequestMapping(value = "/accountUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userUpdateAH(HttpServletRequest request) throws Exception {
        return userService.updateAccount(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/accountEnabled", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userEnabledAH(HttpServletRequest request) throws Exception {
        return userService.multifunctionAccountAH(request, 1).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/accountAbandon", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userAbandonAH(HttpServletRequest request) throws Exception {
        return userService.multifunctionAccountAH(request, 0).toString();
    }
}
