package com.core.controller;

import com.core.security.annotation.AsRight;
import com.core.security.annotation.RightCheck;
import com.core.service.HomePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
        return homePageService.staticIndex(userId).toString();
    }

    @AsRight(id = 2, depict = "首页主/副导航")
    @ResponseBody
    @RequestMapping("/nav")
    public String createNav(long id) {
        return homePageService.staticNav(id).toString();
    }

    @AsRight(id = 3, depict = "首页广种福田、联系我们静态化")
    @ResponseBody
    @RequestMapping("/embed")
    public String createEmbed(long id) {
        return homePageService.staticFutian(id).toString();
    }

    @AsRight(id = 4, depict = "首页紫云法务静态化")
    @RequestMapping("/fawu")
    public String createFawu() {
        homePageService.staticFawu();
        return getViewRedirect("/article/index.html");
    }

    @AsRight(id = 5, depict = "首页广告位静态化")
    @ResponseBody
    @RequestMapping("/ad")
    public String createAd(@RequestParam("userId") int userId) {
        return homePageService.staticAd(userId).toString();
    }

    @AsRight(id = 6, depict = "文章栏目列表")
    @ResponseBody
    @RequestMapping("/articleList")
    public String articleList() {
        return homePageService.staticArticleList().toString();
    }

}
