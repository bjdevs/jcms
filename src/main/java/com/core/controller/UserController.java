package com.core.controller;

import com.core.domain.User;
import com.core.security.SecuritySupport;
import com.core.security.annotation.AsRight;
import com.core.security.annotation.RightCheck;
import com.core.service.UserService;
import com.core.util.Constant;
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
@RightCheck(depict = "账号管理")
@Controller
@RequestMapping("/admin")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @ResponseBody
    @RequestMapping(value = "/userUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userUpdate(User user) throws Exception {
        return userService.updateInfo(user).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/userChangePassWord", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userChangePassWord(User user) throws Exception {
        return userService.changePassWord(user).toString();
    }

    // 账号管理 -> 新增
    @AsRight(id = 100)
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
    @RequestMapping(value = "/accountListNoPageNumber", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void userTypeShowNoPageNumber(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(userService.getListNoPageNumber(request));
    }

    // 账号管理 -> 保存
    @AsRight(id = 100)
    @ResponseBody
    @RequestMapping(value = "/accountUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userUpdateAH(HttpServletRequest request) throws Exception {
        return userService.updateAccount(request).toString();
    }

    // 账号管理 -> 启用
    @AsRight(id = 101)
    @ResponseBody
    @RequestMapping(value = "/accountEnabled", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userEnabledAH(HttpServletRequest request) throws Exception {
        return userService.multifunctionAccountAH(request, Constant.GENERAL_ID_ONE).toString();
    }

    // 账号管理 -> 禁用
    @AsRight(id = 101)
    @ResponseBody
    @RequestMapping(value = "/accountAbandon", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userAbandonAH(HttpServletRequest request) throws Exception {
        return userService.multifunctionAccountAH(request, Constant.GENERAL_ID_ZERO).toString();
    }

    // 账号管理 -> 密码重置
    @AsRight(id = 102)
    @ResponseBody
    @RequestMapping(value = "/accountRecover", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String userRecoverAH(HttpServletRequest request) throws Exception {
        return userService.multifunctionAccountAH(request, Constant.GENERAL_ID_THREE).toString();
    }
}
