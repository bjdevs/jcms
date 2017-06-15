package com.core.controller;

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
public class LogController extends BaseController {
    @Autowired
    private LogService logService;

    @ResponseBody
    @RequestMapping(value = "/logList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void logTypeShow(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(logService.getList(request));
    }

    @ResponseBody
    @RequestMapping(value = "/logSearchModule", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void logSearchModule(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(logService.getSearchModuleActionList(request, true));
    }

    @ResponseBody
    @RequestMapping(value = "/logSearchAction", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void loglogSearchAction(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(logService.getSearchModuleActionList(request, false));
    }
}
