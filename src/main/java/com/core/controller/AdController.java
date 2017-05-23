package com.core.controller;

import com.core.service.AdService;
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
public class AdController extends BaseController {
    @Autowired
    private AdService adService;

    @ResponseBody
    @RequestMapping(value = "/adList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void adTypeShow(HttpServletRequest request,HttpServletResponse response) throws Exception {
        response.getWriter().print(adService.getList(request));
    }

    @ResponseBody
    @RequestMapping(value = "/adCreate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adCreateAH(HttpServletRequest request) throws Exception {
        return adService.createAd(request);
    }

    @ResponseBody
    @RequestMapping(value = "/adEnabled", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adEnabledAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request,1).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/adAbandon", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adAbandonAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request,0).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/adDelete", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adDeleteAH(HttpServletRequest request) throws Exception {
        return adService.multifunctionAdAH(request,2).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/adUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String adUpdateAH(HttpServletRequest request) throws Exception {
        return adService.updateAd(request).toString();
    }
}
