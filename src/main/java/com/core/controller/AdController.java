package com.core.controller;

import com.core.security.annotation.AsRight;
import com.core.security.annotation.RightCheck;
import com.core.service.AdService;
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
@RightCheck(depict = "广告管理")
@Controller
@RequestMapping("/admin")
public class AdController extends BaseController {
    @Autowired
    private AdService adService;

    @ResponseBody
    @RequestMapping(value = "/adList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void adTypeShow(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(adService.getList(request));
    }

    @AsRight(id = 110)
    @ResponseBody
    @RequestMapping(value = "/adCreate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adCreateAH(HttpServletRequest request) throws Exception {
        return adService.createAd(request);
    }

    @AsRight(id = 111)
    @ResponseBody
    @RequestMapping(value = "/adEnabled", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adEnabledAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request, Constant.GENERAL_ID_ONE).toString();
    }

    @AsRight(id = 111)
    @ResponseBody
    @RequestMapping(value = "/adAbandon", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adAbandonAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request, Constant.GENERAL_ID_ZERO).toString();
    }

    @AsRight(id = 111)
    @ResponseBody
    @RequestMapping(value = "/adDelete", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adDeleteAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request, Constant.GENERAL_ID_TWO).toString();
    }

    @AsRight(id = 111)
    @ResponseBody
    @RequestMapping(value = "/adPublish", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adPublishAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request, Constant.GENERAL_ID_NINE).toString();
    }

    @AsRight(id = 111)
    @ResponseBody
    @RequestMapping(value = "/adUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adUpdateAH(HttpServletRequest request) throws Exception {
        return adService.updateAd(request).toString();
    }
}
