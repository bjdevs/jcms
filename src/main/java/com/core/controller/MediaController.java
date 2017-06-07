package com.core.controller;

import com.core.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by sun on 2017/5/2.
 */
@Controller
@RequestMapping("/admin")
public class MediaController extends BaseController {
    @Autowired
    private MediaService mediaService;

    @ResponseBody
    @RequestMapping(value = "/mediaList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public void mediaTypeShow(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().print(mediaService.getList(request));
    }

    @ResponseBody
    @RequestMapping(value = "/mediaCreate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String mediaUpdateAH(MultipartHttpServletRequest msr) throws Exception {
        return mediaService.createMedia(msr);
    }

    @ResponseBody
    @RequestMapping(value = "/mediaUpdate", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String mediaUpdateAH(HttpServletRequest request) throws Exception {
        return mediaService.updateMedia(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/mediaDelete", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String mediaDeleteAH(HttpServletRequest request) throws Exception {
        return mediaService.multifunctionMediaAH(request, 2).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/mediaEnabled", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String mediaEnabledAH(HttpServletRequest request) throws Exception {
        return mediaService.multifunctionMediaAH(request, 1).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/mediaAbandon", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String mediaAbandonAH(HttpServletRequest request) throws Exception {
        return mediaService.multifunctionMediaAH(request, 0).toString();
    }
}
