package com.core.controller;

import com.core.service.SerialService;
import com.core.util.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

/**
 * Created by yk on 2017/5/27.
 */
@Controller
@RequestMapping("/serial")
public class SerialController {

    @Autowired
    private SerialService serialService;

    @ResponseBody
    @RequestMapping(value = "/serialList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String serialList(int start, int limit){
        return serialService.serialList(start, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/serialBtn", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String serialBtn(@RequestParam("method") String method, String data, String account, int[] ids){
        return serialService.serialBtn(method, data, account, ids).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/createSerial", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createSerial(HttpServletRequest request){
        return serialService.createSerial(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/serialQuery", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String serialQuery(int status){
        return serialService.serialQuery(status).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/serialQueryForId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String serialQueryForId(long id){
        return serialService.serialQueryForId(id).toString();
    }

}
