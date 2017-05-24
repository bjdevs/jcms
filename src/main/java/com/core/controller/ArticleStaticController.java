package com.core.controller;

import com.core.security.annotation.AsRight;
import com.core.security.annotation.RightCheck;
import com.core.service.HomePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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

    @AsRight(id = 1, depict = "创建index静态首页")
    @ResponseBody
    @RequestMapping("/index")
    public String createIndex(int userId) {
        System.out.println(userId);
        return homePageService.staticIndex(userId).toString();
    }

    @AsRight(id = 2, depict = "首页主/副导航")
    @ResponseBody
    @RequestMapping("/nav")
    public String createNav() {
        return homePageService.staticNav().toString();
    }

    @AsRight(id = 7, depict = "首页广种福田、联系我们静态化")
    @RequestMapping("/futian")
    public String createFutian() {
        homePageService.staticFutian();
        return getViewRedirect("/article/index.html");
    }

    @AsRight(id = 8, depict = "首页紫云法务静态化")
    @RequestMapping("/fawu")
    public String createFawu() {
        homePageService.staticFawu();
        return getViewRedirect("/article/index.html");
    }

    @AsRight(id = 9, depict = "首页广告位静态化")
    @RequestMapping("/ad")
    public String createAd() {
        homePageService.staticAd();
        return getViewRedirect("/article/index.html");
    }

    @AsRight(id = 10, depict = "首页活动通知静态化")
    @RequestMapping("/notice")
    public String createNotice() {
        homePageService.staticNotice();
        return getViewRedirect("/article/index.html");
    }

}
