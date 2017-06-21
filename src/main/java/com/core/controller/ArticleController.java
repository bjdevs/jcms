package com.core.controller;

import com.core.security.annotation.AsRight;
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

    /**
     * 文章列表
     *
     * @param category
     * @param start
     * @param limit
     * @param id
     * @param title
     * @param startdate
     * @param enddate
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/articleList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String article(@RequestParam("category") String category, int start, int limit, String id, String title, String startdate, String enddate) {
        return articleService.list(category, start, limit, id, title, startdate, enddate).toString();
    }

    /**
     * 头条列表
     *
     * @param category
     * @param type
     * @param page
     * @param start
     * @param limit
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/headLine", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String HeadLine(@RequestParam("category") String category, @RequestParam("type") String type, int page, int start, int limit) {
        return articleService.headLineList(category, type, start, limit).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/headLineForId", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String headLineForId(@RequestParam("aId") long aId, String type) {
        return articleService.headLineForId(aId, type).toString();
    }

    /**
     * 修改头条
     *
     * @param data
     * @return
     */
    @AsRight(id = 131)
    @ResponseBody
    @RequestMapping(value = "/updateHeadLine", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateHeadLineAH(String data) {
        return articleService.updateHeadLine(data).toString();
    }

    /**
     * 处理头条按钮
     *
     * @param method
     * @param ids
     * @param type
     * @param account
     * @return
     */
    @AsRight(id = 131)
    @ResponseBody
    @RequestMapping(value = "/headLineBtn", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String headLineBtnAH(@RequestParam("method") String method, @RequestParam("ids") long[] ids, int type, String account) {
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


    /**
     * 新增文章
     *
     * @return
     */
    @AsRight(id = 130)
    @ResponseBody
    @RequestMapping(value = "/createArticle", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createArticleAH() {
        return articleService.createArticle(request).toString();
    }

    /**
     * 修改文章状态
     *
     * @param method
     * @param ids
     * @param type
     * @return
     */
    @AsRight(id = 130)
    @ResponseBody
    @RequestMapping(value = "/articleButton", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String articleButtonAH(String method, String[] ids, String type) {
        if (!StringUtils.isBlank(type)) {
            method = type;
        }
        return articleService.updateArticleStatus(method, ids).toString();
    }

    /**
     * 修改文章分类
     *
     * @param category
     * @param ids
     * @return
     */
    @AsRight(id = 131)
    @ResponseBody
    @RequestMapping(value = "/articleChangeCategory", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String articleChangeCategoryAH(@RequestParam("category") String category, String[] ids) {
        return articleService.updateArticleCategory(category, ids).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/keyWordList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String keyWordList(@RequestParam("type") String type, int start, int limit) {
        return articleService.keyWordList(type, start, limit).toString();
    }

    /**
     * 修改 标签
     *
     * @param data
     * @param ids
     * @return
     */
    @AsRight(id = 132)
    @ResponseBody
    @RequestMapping(value = "/keyWordSave", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateKeyWordAH(String data, String[] ids) {
        return articleService.updateKeyWord(data, ids).toString();
    }


    /**
     * 新增keyword
     *
     * @param request
     * @return
     */
    @AsRight(id = 133)
    @ResponseBody
    @RequestMapping(value = "/createKeyWord", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createKeyWordAH(HttpServletRequest request) {
        return articleService.createKeyWord(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/categoryList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String categoryList(int start, int limit) {
        return articleService.categoryList(start, limit).toString();
    }

    /**
     * 目录模版保存处理
     *
     * @param method
     * @param data
     * @return
     */
    @AsRight(id = 134)
    @ResponseBody
    @RequestMapping(value = "/categoryBtn", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String categoryBtnAH(@RequestParam("method") String method, String data) {
        return articleService.categoryBtn(method, data).toString();
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

    /**
     * 用于修改导航、...
     *
     * @param id
     * @param content
     * @return
     */
    @AsRight(id = 135)
    @ResponseBody
    @RequestMapping(value = "/updateArticleForId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateArticleForIdAH(long id, String content) {
        return articleService.updateArticleForId(id, content).toString();
    }

    /**
     * 用于修改紫云法务
     *
     * @param id
     * @param content
     * @return
     */
    @AsRight(id = 136)
    @ResponseBody
    @RequestMapping(value = "/updateEmbedForId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateEmbedForIdAH(long id, String content) {
        return articleService.updateEmbedForId(id, content).toString();
    }

    /**
     * 修改广种福田
     *
     * @param request
     * @return
     */
    @AsRight(id = 136)
    @ResponseBody
    @RequestMapping(value = "/updateFutian", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateFutianAH(HttpServletRequest request) {
        return articleService.updataFutian(request).toString();
    }

    /**
     * 修改 联系我们
     *
     * @param request
     * @return
     */
    @AsRight(id = 136)
    @ResponseBody
    @RequestMapping(value = "/updateContact", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateContactAH(HttpServletRequest request) {
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

    /**
     * 创建头条
     *
     * @param request
     * @return
     */
    @AsRight(id = 131)
    @ResponseBody
    @RequestMapping(value = "/createHeadLine", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String createHeadLineAH(HttpServletRequest request) {
        return articleService.createHeadLine(request).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/mediaImgList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String mediaList() {
        return articleService.mediaList().toString();
    }

    /**
     * 重置导航
     *
     * @param type
     * @return
     */
    @AsRight(id = 135)
    @ResponseBody
    @RequestMapping(value = "/resetNav", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String resetNavAH(String type) {
        return articleService.resetNav(type).toString();
    }

    /**
     * 预览文章
     *
     * @param id
     * @return
     */
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

    /**
     * 修改文章
     *
     * @return
     */
    @AsRight(id = 130)
    @ResponseBody
    @RequestMapping(value = "/updateArticle", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String updateArticleAH() {
        return articleService.updateArticle().toString();
    }

    /**
     * 审核文章
     *
     * @param id
     * @return
     */
    @AsRight(id = 130)
    @ResponseBody
    @RequestMapping(value = "/auditArticleForId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String auditArticleForIdAH(long id) {
        return articleService.auditArticleForId(id).toString();
    }

    @ResponseBody
    @RequestMapping(value = "/getEmbedInfo", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String getEmbedInfo(long id) {
        return articleService.getEmbedInfo(id).toString();
    }
}
