package com.core.controller;

import com.core.security.annotation.AsRight;
import com.core.security.annotation.RightCheck;
import com.core.service.HomePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by yk on 2017/4/24.
 * 创建静态文章控制器
 */
@RightCheck(depict = "静态页面控制器")
@Controller
@RequestMapping("/article/create")
public class ArticleStaticController extends BaseController {

    @Autowired
    private HomePageService homePageService;

    @AsRight(id = 137)
    @ResponseBody
    @RequestMapping("/index")
    public String createIndexAH(HttpServletRequest request) {
        return homePageService.staticIndex(request).toString();
    }

    @ResponseBody
    @RequestMapping("/nav")
    public String createNav(long id) {
        return homePageService.staticNav(id).toString();
    }

    @ResponseBody
    @RequestMapping("/embed")
    public String createEmbed(long id) {
        return homePageService.staticFutian(id).toString();
    }

    @RequestMapping("/fawu")
    public String createFawu() {
        homePageService.staticFawu();
        return getViewRedirect("/article/index.html");
    }

    @AsRight(id = 137)
    @ResponseBody
    @RequestMapping("/ad")
    public String createAdAH(HttpServletRequest request) {
        return homePageService.staticAd(request).toString();
    }

    @ResponseBody
    @RequestMapping("/articleList")
    public String articleList() {
        return homePageService.staticArticleList().toString();
    }

}
