package com.core.controller;

import com.core.security.annotation.AsRight;
import com.core.service.AuthService;
import com.core.service.LogService;
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
public class AuthController extends BaseController {
    @Autowired
    private AuthService authService;

    /////////////
    // 功能管理
    /////////////
    @ResponseBody
    @RequestMapping(value = "/authFunctionList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void authFunctionList(HttpServletRequest request,HttpServletResponse response) throws Exception {
        response.getWriter().print(authService.getFunctionList(request));
    }

    @AsRight(id = 500)
    @ResponseBody
    @RequestMapping(value = "/authFunctionUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String authFunctionUpdateAH(HttpServletRequest request) throws Exception {
        return authService.updateAuthFunction(request);
    }

    @AsRight(id = 500)
    @ResponseBody
    @RequestMapping(value = "/authFunctionDelete", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String authFunctionDeleteAH(HttpServletRequest request) throws Exception {
        return authService.multifunctionAuthFunctionAH(request,2).toString();
    }

    /////////////
    // 角色管理
    /////////////
    @AsRight(id = 500)
    @ResponseBody
    @RequestMapping(value = "/authRoleList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void authRoleList(HttpServletRequest request,HttpServletResponse response) throws Exception {
        response.getWriter().print(authService.getRoleList(request));
    }

    @AsRight(id = 500)
    @ResponseBody
    @RequestMapping(value = "/authRoleUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String authRoleUpdateAH(HttpServletRequest request,HttpServletResponse response) throws Exception {
        return authService.updateAuthRoleFunction(request);
    }

    @AsRight(id = 500)
    @ResponseBody
    @RequestMapping(value = "/authRoleFunctionDelete", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adRoleFunctionRoleDeleteAH(HttpServletRequest request) throws Exception {
        return authService.multifunctionAuthRoleFunctionAH(request,2).toString();
    }

    //////////////////
    // 用户权限管理
    //////////////////
    @ResponseBody
    @RequestMapping(value = "/authAuthorityList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void authAuthorityList(HttpServletRequest request,HttpServletResponse response) throws Exception {
        response.getWriter().print(authService.getAuthList(request));
    }

    @AsRight(id = 500)
    @ResponseBody
    @RequestMapping(value = "/authorityUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String authAuthorityUpdateAH(HttpServletRequest request,HttpServletResponse response) throws Exception {
        return authService.updateAuth(request);
    }

    @ResponseBody
    @RequestMapping(value = "/authDataNavs", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String authDataNavsAH(HttpServletRequest request,HttpServletResponse response) throws Exception {
        return authService.authDataNavs(request);
    }
}
