package com.core.controller;

import com.core.security.annotation.RightCheck;
import com.core.service.ArticleService;
import com.core.service.GeneralArticleService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;

/**
 * Created by yk on 2017/5/3.
 */
@RightCheck(depict = "文章控制器")
@Controller
@RequestMapping("/article")
public class ArticleController extends BaseController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private GeneralArticleService generalArticleService;

    @ResponseBody
    @RequestMapping(value = "/articleList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String article(@RequestParam("category") String category, int start, int limit, String id, String title, String startdate, String enddate) {
        return articleService.list(category, start, limit, id, title, startdate, enddate).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/headLine", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String HeadLine(@RequestParam("category") String category, @RequestParam("type") String type, int page, int start, int limit) {
        return articleService.headLineList(category, type, start, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/updateHeadLine", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateHeadLine(@RequestParam("id") long id, int status, String redStatus, int cateOrderBy, String name) {
        return articleService.updateHeadLine(id, status, redStatus, cateOrderBy, name).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/headLineBtn", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String headLineBtn(@RequestParam("method") String method, @RequestParam("ids") long[] ids, int type, String account) {
        return articleService.headLineBtn(method, ids, type, account).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/getKeyWord", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String KeyWords() {
        return generalArticleService.getKeyWord().toString();
    }

    @ResponseBody
    @RequestMapping(value = "/getArticleKeyWord", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String getArticleKeyWord(int aId) {
        return generalArticleService.getArticleKeyWord(aId).toString();
    }


    @ResponseBody
    @RequestMapping(value = "/createArticle", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createArticle() {
        return articleService.createArticle(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/articleButton", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String articleButton(String method, String[] ids, String type) {
        if (!StringUtils.isBlank(type)) {
            method = type;
        }
        return articleService.updateArticleStatus(method, ids).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/articleChangeCategory", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String articleChangeCategory(@RequestParam("category") String category, String[] ids) {
        return articleService.updateArticleCategory(category, ids).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/keyWordList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String keyWordList(@RequestParam("type") String type, int start, int limit) {
        return articleService.keyWordList(type, start, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/keyWordSave", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateKeyWord(String data, String[] ids) {

        return articleService.updateKeyWord(data, ids).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/createKeyWord", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createKeyWord(HttpServletRequest request) {

        return articleService.createKeyWord(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/categoryList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String categoryList(int start, int limit) {
        return articleService.categoryList(start, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/categoryENameList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String categoryENameList() {
        return articleService.categoryENameList().toString();
    }

    @ResponseBody
    @RequestMapping(value = "/templateList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String templateList(int start, int limit) {
        return articleService.templateList(start, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/templateListForId", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String templateListForId(@RequestParam("type") int type) {
        return articleService.templateListForId(type).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/articleForId", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String articleForId(long id) {
        return articleService.getArticleForId(id).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/articleEmbedForId", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String articleEmbedForId(long id) {
        return articleService.articleEmbedForId(id).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/updateArticleForId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateArticleForId(long id, String content) {
        return articleService.updateArticleForId(id, content).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/updateEmbedForId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateEmbedForId(long id, String content) {
        return articleService.updateEmbedForId(id, content).toString();
    }


    @ResponseBody
    @RequestMapping(value = "/updateFutian", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateFutian(HttpServletRequest request) {
        return articleService.updataFutian(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/updateContact", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateContact(HttpServletRequest request) {
        return articleService.updateContact(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/getFileInfo", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String getFileInfo() {
        return articleService.getFileInfo().toString();
    }

    @ResponseBody
    @RequestMapping(value = "/publishList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String publishList(int page, int limit) {
        return articleService.publishList(page, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/createHeadLine", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createHeadLine(HttpServletRequest request) {
        return articleService.createHeadLine(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/mediaImgList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String mediaList() {
        return articleService.mediaList().toString();
    }

    @ResponseBody
    @RequestMapping(value = "/resetNav", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String resetNav(String type) {
        return articleService.resetNav(type).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/articlePreview", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String articlePreview(long id) {
        return articleService.articlePreview(id).toString();
    }

    @RequestMapping(value = "/preview", method = RequestMethod.GET)
    public String preview(String id) {
        String date = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        request.setAttribute("target", date + "/" + id + ".html");
        return getView("preview");
    }

    @ResponseBody
    @RequestMapping(value = "/updateArticle", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateArticle() {
        return articleService.updateArticle().toString();
    }
}
