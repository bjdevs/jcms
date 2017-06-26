package com.core.service;

import com.core.config.Config;
import com.core.domain.*;
import com.core.util.Constant;
import com.core.util.IpUtil;
import com.google.gson.JsonObject;
import org.apache.commons.collections.map.HashedMap;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.tools.ToolContext;
import org.apache.velocity.tools.ToolManager;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by yk on 2017/4/24.
 */
@Service
public class HomePageService extends BaseService {

    @Autowired
    private ToolManager toolManager;

    @Autowired
    private Config config;

    @Autowired
    private HeadLineService headLineService;

    private Log log;

    private JsonObject jsonObject = new JsonObject();

    /**
     * 静态化 首页
     */
    public ObjectNode staticIndex(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        log = new Log();
        ObjectNode objectNode = objectMapper.createObjectNode();

        long publishId = createPublishLog(user.getId(), "首页静态化");
        PublishLog publishLog = find(PublishLog.class, publishId);

        String staticResPrefix = config.getStaticResourceURLPrefix();
        String listDomain = config.getListDomain();

        ToolContext toolManagerContext = toolManager.createContext();

        String depict = "古名紫云山寺，位于黄梅紫云山莲花峰下，" +
                "毗邻避暑胜地挪步园风景区，为鄂东古刹之最。是印度高僧千岁宝掌和尚于" +
                "汉景帝中元6年（公元前144年）开创。现已成为避暑览胜、礼佛参禅的现代旅" +
                "游景区。";

        //返回绑定的文件路径
        toolManagerContext.put("resURLPrefix", staticResPrefix);
        toolManagerContext.put("listURLPrefix", listDomain);
        toolManagerContext.put("winTitle", "首页_" + config.getProjectName());
        toolManagerContext.put("depict", depict);
        toolManagerContext.put("keyWord", " ");

        log.setIp(IpUtil.getIp(request));
        log.setAccount(find(User.class, user.getId()).getAccount());
        log.setName("发布管理");
        log.setAction("首页");

        try {

            // 焦点图
            Map<String, Object> focus = staticOtherModules(Constant.CATEGORY_ID_FOCUS, Constant.GENERAL_ID_TWO);
            if (focus.containsKey("temp") && focus.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("focus", focus);

            // 新闻法讯
            Map<String, Object> news = staticOtherModules(Constant.CATEGORY_ID_NEWS, Constant.GENERAL_ID_ONE);
            if (news.containsKey("temp") && news.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("news", news);

            // 生活禅
            Map<String, Object> life = staticOtherModules(Constant.CATEGORY_ID_LIFE, Constant.GENERAL_ID_TWO);
            if (life.containsKey("temp") && life.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("life", life);

            // 紫云佛国
            Map<String, Object> ziyun = staticOtherModules(Constant.CATEGORY_ID_ZIYUNFOGUO, Constant.GENERAL_ID_TWO);
            if (ziyun.containsKey("temp") && ziyun.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("ziyun", ziyun);

            // 佛教常识
            Map<String, Object> knowledge = staticOtherModules(Constant.CATEGORY_ID_KNOWLEDGE, Constant.GENERAL_ID_TWO);
            if (knowledge.containsKey("temp") && knowledge.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("knowledge", knowledge);

            // 禅医养生
            Map<String, Object> medical = staticOtherModules(Constant.CATEGORY_ID_MEDICAL, Constant.GENERAL_ID_TWO);
            if (medical.containsKey("temp") && medical.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("medical", medical);

            // 藏经阁
            Map<String, Object> depository = staticOtherModules(Constant.CATEGORY_ID_DEPOSITORY, Constant.GENERAL_ID_ONE);
            toolManagerContext.put("depository", depository);

            // 水墨禅韵
            Map<String, Object> waterzen = staticOtherModules(Constant.CATEGORY_ID_WATERZEN, Constant.GENERAL_ID_TWO);
            if (waterzen.containsKey("temp") && waterzen.get("temp").equals("false")) {
                publishLog.setStatus(0);
                publishLog.setFinishDate(new Date());
                update(publishLog);
            }
            toolManagerContext.put("waterzen", waterzen);

            // 活动通知
            staticNotice();

            // 导航
            staticNav(0);

            // 广种福田、联系我们
            staticFutian(0);

            // 紫云法务
            staticFawu();

            // banner
//            staticAd();

            create("/index.html", "base/index.vm", toolManagerContext, null);

            publishLog.setFinishDate(new Date());
            update(publishLog);
            objectNode.put("success", true);

            log.setContent("发布首页成功");

        } catch (Exception e) {
            e.printStackTrace();
            publishLog.setStatus(0);
            publishLog.setFinishDate(new Date());
            update(publishLog);
            objectNode.put("success", false);
            log.setContent("发布首页异常：" + e.getMessage());
        }

        log.setCreateDate(new Date());
        create(log);
        return objectNode;
    }

    /**
     * 静态化 导航
     */
    public ObjectNode staticNav(long idStr) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        long id = createPublishLog(1, "导航");
        PublishLog publishLog = find(PublishLog.class, id);
        try {
            String[] mainNav;
            String[] deputyNav;
            ToolContext toolManagerContext = toolManager.createContext();

            if (idStr == 1 || idStr == 2) {
                Article article = find(Article.class, idStr);
                if (article.getStatus() != Constant.ARTICLE_ID_ONE) {
                    objectNode.put("success", "error");
                    return objectNode;
                }
            }
            mainNav = searchNav("main");
            deputyNav = searchNav("deputy");

            if (null != mainNav && null != deputyNav) {
                toolManagerContext.put("main", mainNav);
                toolManagerContext.put("deputy", deputyNav);
                create("/base/nav.html", "base/nav.vm", toolManagerContext, null);
                objectNode.put("success", true);
            }

            if (idStr == 1 || idStr == 2) {
                Article article = find(Article.class, idStr);
                objectNode.put("status", article.getStatus());
                objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
            }


        } catch (Exception e) {
            publishLog.setStatus(0);
            objectNode.put("success", false);
            objectNode.put("result", e.getMessage());
        }
        publishLog.setFinishDate(new Date());
        update(publishLog);
        return objectNode;
    }

    /**
     * 静态化 广种福田、联系我们
     */
    public ObjectNode staticFutian(long idStr) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        long id = createPublishLog(1, "广种福田、联系我们");
        PublishLog publishLog = find(PublishLog.class, id);
        try {
            if (idStr == 3 || idStr == 4) {
                Article article = find(Article.class, idStr);
                if (article.getStatus() != Constant.ARTICLE_ID_ONE) {
                    objectNode.put("success", "error");
                    return objectNode;
                }
            }

            String[] resultFutian = searchFutian();

            List<String[]> resultContact = searchContact();

            ToolContext toolManagerContext = toolManager.createContext();
            toolManagerContext.put("futian", resultFutian);
            toolManagerContext.put("contact", resultContact);

            create("/base/futian.html", "base/futian.vm", toolManagerContext, null);
            if (idStr == 3 || idStr == 4) {
                Article article = find(Article.class, idStr);
                objectNode.put("status", article.getStatus());
                objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
            }
            objectNode.put("success", true);
        } catch (Exception e) {
            publishLog.setStatus(0);
            objectNode.put("success", false);
        }
        publishLog.setFinishDate(new Date());
        update(publishLog);

        return objectNode;
    }

    /**
     * 静态化 紫云法务
     */
    public void staticFawu() {
        long id = createPublishLog(1, "紫云法务");
        PublishLog publishLog = find(PublishLog.class, id);

        try {
            Map map = new HashedMap();
            List<String[]> res = new ArrayList<String[]>();

            String name = find(Category.class, Constant.CATEGORY_ID_LAW).getName();
            map.put("name", name);

            List<String[]> resultList = searchFawu();
            for (int i = 0; i < resultList.size(); i++) {
                String[] result = resultList.get(i);

                String title = result.length >= 0 ? result[0] : "";
                if (title.length() > 5) {
                    title = title.substring(0, title.length() >= 4 ? 4 : title.length()) + "...";
                    result[0] = title;
                }

                String content = result.length >= 3 ? result[2] : "";
                content = contentReplace(content);
                content = content.substring(0, content.length() > 270 ? 270 : content.length()) + "...";
                result[2] = content;
                res.add(i, result);
            }

            ToolContext toolManagerContext = toolManager.createContext();
            toolManagerContext.put("law", map);
            toolManagerContext.put("content", res);

            create("/base/fawu.html", "base/fawu.vm", toolManagerContext, null);

        } catch (Exception e) {
            publishLog.setStatus(0);
        }

        publishLog.setFinishDate(new Date());
        update(publishLog);

    }

    /**
     * 静态化 广告位
     *
     * @param adList: 为null不发布广告；left为list.get(0),right为list.get(1)
     * @return 修改了静态页面：true；为修改静态页面：false
     */
    public boolean staticAd(List<Ad> adList, long userId) {
        boolean result = false;

        long id = createPublishLog(userId, "广告位");
        PublishLog publishLog = find(PublishLog.class, id);
        try {
            List<Ad> resultAdList = new ArrayList<>();
            Ad[] ads = new Ad[2];
            for (int i = 0; i < adList.size(); i++) {
                Ad ad = adList.get(i);
                if (Constant.AD_LOCATION_LEFT.equals(ad.getLocation())) {
                    ads[0] = ad;
                }
                if (Constant.AD_LOCATION_RIGHT.equals(ad.getLocation())) {
                    ads[1] = ad;
                }
            }

            for (int i = 0; i < ads.length; i++) {
                resultAdList.add(ads[i]);
            }

            ToolContext toolManagerContext = toolManager.createContext();
            toolManagerContext.put("ad", resultAdList);

            create("/base/banner.html", "base/banner.vm", toolManagerContext, null);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
            publishLog.setStatus(0);
        }
        publishLog.setFinishDate(new Date());
        update(publishLog);
        return result;
    }

    /**
     * 静态化 活动通知
     */
    public void staticNotice() throws Exception {
        long id = createPublishLog(1, "活动通知");
        PublishLog publishLog = find(PublishLog.class, id);
        try {
            List<HeadLine> resultHeadLine = searchNotice();
            List<String[]> list = new ArrayList<String[]>();
            ToolContext toolManagerContext = toolManager.createContext();

            if (null != resultHeadLine) {
                for (int i = 0; i < resultHeadLine.size(); i++) {
                    HeadLine headLine = resultHeadLine.get(i);
                    Article article = null != headLine ? find(Article.class, headLine.getaId()) : null;
                    if (null != article) {
                        String[] items = new String[2];
                        items[0] = article.getUrl();
                        items[1] = headLine.getRedStatus() == 1 ? "<strong>" + headLine.getName() + config.getPostTag() : headLine.getName();
                        list.add(i, items);
                    }
                }
            }

            toolManagerContext.put("notice", list);

            create("/base/notice.html", "base/notice.vm", toolManagerContext, null);

        } catch (Exception e) {
            e.printStackTrace();
            publishLog.setStatus(0);
            throw new Exception(e.getMessage());
        }

        publishLog.setFinishDate(new Date());
        update(publishLog);
    }

    /**
     * 发布文章
     *
     * @param id
     * @return
     */
    public String articlePublish(long id, String type) {
        String staticResPrefix = config.getStaticResourceURLPrefix();

        ToolContext toolManagerContext = toolManager.createContext();

        //返回绑定的文件路径
        toolManagerContext.put("resURLPrefix", staticResPrefix);

        Article article = find(Article.class, id);
        article.setPublishDate(new Date());
        if (null != article) {

            Map<String, Object> params = new HashedMap();
            params.put("aId", article.getId());
            List<ArticleKeyWord> articleKeyWords = list(ArticleKeyWord.class, "WHERE aId = :aId ORDER BY orderBy ASC", params);
            String kw = "";
            for (int i = 0; i < articleKeyWords.size(); i++) {
                ArticleKeyWord articleKeyWord = articleKeyWords.get(i);
                KeyWord keyWord = find(KeyWord.class, articleKeyWord.getkId());
                kw += keyWord.getName() + ",";
            }
            String doc = article.getDepict();
            if (doc.contains("\"")) {
                doc = doc.replaceAll("\"", "");
            }
            toolManagerContext.put("keyWord", kw.contains(",") ? kw.substring(0, kw.length() - 1) : kw);
            toolManagerContext.put("winTitle", article.getTitle());
            toolManagerContext.put("depict", doc);

            Category category = find(Category.class, article.getcId());
            // 封装content
            String[] contents = getStaticArticleInfoArray(article);
            StringBuffer stringBuffer = new StringBuffer();
            for (int i = 0; i < contents.length; i++) {
                stringBuffer.append(contents[i]);
            }
            Map<String, Object> map = new HashedMap();
//            map.put("content", contents[0]);
            map.put("title", article.getTitle());
            map.put("publishDate", article.getPublishDate());
            map.put("source", article.getSource());
            map.put("author", article.getAuthor());
            map.put("categoryId", article.getcId());
            map.put("showCategory", category.getName());
            map.put("category", category.getName());
            map.put("categoryUrl", getCategoryList(category.getId()));
            map.put("publishDate", new SimpleDateFormat("yyyy-MM-dd").format(article.getPublishDate()));
//            map.put("pageContent", "<a href=\"#\">上一页</a>");

            String finalPath = getArticlePathSuffix(category.geteName(), article.getId(), "", "");

            if (null != type && "preview".equals(type)) {
                articleStaticDispose(contents, category, article, map, staticResPrefix, toolManagerContext, stringBuffer, "preview");
            } else {
                articleStaticDispose(contents, category, article, map, staticResPrefix, toolManagerContext, stringBuffer, null);
            }

            if (null != type && "preview".equals(type)) {
                return getPreviewResultPathSuffix((config.getArticleIdAddend() + id) + "");
            } else {
                return staticResPrefix + File.separator + finalPath;
            }
        }
        return null;
    }

    /**
     * * 创建静态页面
     *
     * @param create:静态文件放置路径
     * @param templatePath：模版文件路径
     * @param toolManagerContext：绑定的数据
     * @param type：是否是预览
     * @return
     */
    private String create(String create, String templatePath, ToolContext toolManagerContext, String type) {
        String createPath = config.getArticleDir();
        if (null != type && ("preview".equals(type) || "jsp".equals(type))) {
            createPath = "";
        } else {
            createPath += File.separator;
        }
        String checkPath = create.substring(0, create.lastIndexOf("/"));
        fileCheck(createPath, checkPath);
        String flag = "success";
        VelocityEngine velocityEngine;
        PrintWriter printWriter;
        try {
            velocityEngine = toolManager.getVelocityEngine();
            printWriter = new PrintWriter(createPath + create, Constant.ENCODE_UTF8);
            velocityEngine.mergeTemplate(templatePath, Constant.ENCODE_UTF8, toolManagerContext, printWriter);

            printWriter.flush();
        } catch (Exception e) {
            e.printStackTrace();
            flag = "error";
            jsonObject.addProperty("message", e.getMessage());
        }
        jsonObject.addProperty("flag", flag);
        return jsonObject.toString();
    }

    /**
     * 获取其他模块Map
     */
    private Map<String, Object> staticOtherModules(int articleId, int different) throws Exception {
        String titleName = articleId == Constant.CATEGORY_ID_FOCUS ? null : getCategoryEName(articleId);
        Map<String, Object> map = new HashMap<String, Object>();
        List<String[]> list;
        HeadLine headLine;
        Article article;
        map.put("name", titleName);
        String[] news;
        List<String[]> other;
        int maxLimit = 4;
        if (articleId == Constant.CATEGORY_ID_NEWS) {
            maxLimit = 9;
        } else if (articleId == Constant.CATEGORY_ID_DEPOSITORY) {
            maxLimit = 7;
        }
        List<HeadLine> headLines = headLineService.searchHeadLine(articleId, different, maxLimit);
        switch (articleId) {
            case Constant.CATEGORY_ID_NEWS:
                // 新闻法讯 -- 文字头条
                news = new String[3];
                other = new ArrayList<String[]>();
                headLine = headLines.size() > 0 ? headLines.get(0) : null;
                if (null != headLine && headLine.getId() > 0) {
                    article = find(Article.class, headLine.getaId());
                    if (null != article) {
                        news[0] = article.getUrl();
                        news[1] = headLine.getRedStatus() == 1 ? config.getPreTag() + headLine.getName() + config.getPostTag() : headLine.getName();
                        news[2] = article.getDepict();
                    }
                    map.put("first", news);
                }
                for (int i = 1; i < headLines.size(); i++) {
                    news = new String[2];
                    HeadLine headLineOther = headLines.get(i);
                    article = find(Article.class, headLineOther.getaId());
                    if (null != article) {
                        news[0] = article.getUrl();
                        news[1] = headLineOther.getRedStatus() == 1 ? config.getPreTag() + headLineOther.getName() + config.getPostTag() : headLineOther.getName();
//                    news[2] = article.getDepict();
                    }
                    other.add(i - 1, news);
                }
                map.put("other", other);
                return map;
            case Constant.CATEGORY_ID_LIFE:
                // 生活禅  limit 0,4
            case Constant.CATEGORY_ID_ZIYUNFOGUO:
                // 紫云佛国  limit 0,4
            case Constant.CATEGORY_ID_KNOWLEDGE:
                // 佛教常识  limit 0,4
            case Constant.CATEGORY_ID_MEDICAL:
                // 禅医养生  limit 0,4
                // 文章链接，头条标题，文章描述，文章日期，头条图片
                news = new String[5];
                headLine = headLines.size() > 0 ? headLines.get(0) : null;
                if (null != headLine && headLine.getId() > 0) {
                    article = find(Article.class, headLine.getaId());
                    Media media = find(Media.class, headLine.getmId());
                    if (null == media) {
                        map.put("temp", "false");
                    }
                    if (null != article) {
                        news[0] = article.getUrl();
                        news[1] = headLine.getRedStatus() == 1 ? config.getPreTag() + headLine.getName() + config.getPostTag() : headLine.getName();
                        news[2] = article.getDepict();
                    }
                    news[3] = null != article.getUpdateDate() ? getArticleDate(article.getUpdateDate()) : getArticleDate(article.getCreateDate());
                    if (articleId == Constant.CATEGORY_ID_LIFE || articleId == Constant.CATEGORY_ID_ZIYUNFOGUO) {
                        news[4] = null != media ? media.getPic_240x160() : "#";
                    } else {
                        news[4] = null != media ? media.getPic_144x96() : "#";
                    }
                }
                map.put("first", news);
                headLines = headLineService.searchHeadLine(articleId, Constant.GENERAL_ID_ONE, maxLimit);
                other = new ArrayList<String[]>();
                for (int i = 0; i < headLines.size(); i++) {
                    news = new String[3];
                    headLine = headLines.get(i);
                    article = find(Article.class, headLine.getaId());
                    if (null != article) {
                        news[0] = article.getUrl();
                        news[1] = headLine.getRedStatus() == 1 ? config.getPreTag() + headLine.getName() + config.getPostTag() : headLine.getName();
                    }
                    news[2] = null != article.getUpdateDate() ? getArticleDate(article.getUpdateDate()) : getArticleDate(article.getCreateDate());
                    other.add(i, news);
                }
                map.put("other", other);
                return map;
            case Constant.CATEGORY_ID_DEPOSITORY:
                // 藏经阁
                list = new ArrayList<String[]>();
                for (int i = 0; i < headLines.size(); i++) {
                    headLine = headLines.get(i);
                    article = find(Article.class, headLine.getaId());
                    String[] items = new String[2];
                    if (null != article) {
                        items[0] = article.getUrl();
                        items[1] = headLine.getRedStatus() == 1 ? config.getPreTag() + headLine.getName() + config.getPostTag() : headLine.getName();
                    }
                    list.add(i, items);
                }
                map.put("list", list);
                return map;
            case Constant.CATEGORY_ID_WATERZEN:
                // 水墨禅韵 limit 0,4
                list = new ArrayList<String[]>();
                for (int i = 0; i < headLines.size(); i++) {
                    news = new String[3];
                    headLine = headLines.get(i);
                    article = find(Article.class, headLine.getaId());
                    Media media = find(Media.class, headLine.getmId());
                    if (null == media) {
                        map.put("temp", "false");
                    }
                    if (null != article) {
                        news[0] = headLine.getRedStatus() == 1 ? config.getPreTag() + headLine.getName() + config.getPostTag() : headLine.getName();
                        news[1] = article.getUrl();
                        news[2] = null != media ? media.getPic_279x186() : "null";
                    }
                    list.add(news);
                }
                map.put("list", list);
                return map;
            case Constant.CATEGORY_ID_FOCUS:
                // 焦点图
                list = new ArrayList<String[]>();
                for (int i = 0; i < headLines.size(); i++) {
                    headLine = headLines.get(i);
                    article = find(Article.class, headLine.getaId());
                    Media media = find(Media.class, headLine.getmId());
                    if (null == media) {
                        map.put("temp", "false");
                    }
                    news = new String[4];
                    if (null != article) {
                        news[0] = headLine.getRedStatus() == 1 ? config.getPreTag() + headLine.getName() + config.getPostTag() : headLine.getName();
                        news[1] = article.getUrl();
                        news[2] = null != media ? media.getPic_630x420() : "null";
                        news[3] = null != media ? media.getPic_102x68() : "null";
                    }
                    list.add(i, news);
                }
                map.put("list", list);
                return map;
            default:
                return null;
        }
    }

    /**
     * 文章栏目列表
     *
     * @return
     */
    public ObjectNode staticArticleList() {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String staticResPrefix = config.getStaticResourceURLPrefix();
        ToolContext toolManagerContext = toolManager.createContext();

        String path = System.getProperty("webapp.root") + "WEB-INF" + File.separator + "admin";

        //返回绑定的文件路径
        toolManagerContext.put("resURLPrefix", staticResPrefix);

        create(path + "/articleList.jsp", "base/articleList.vm", toolManagerContext, "jsp");
        create(path + "/photoList.jsp", "base/photoList.vm", toolManagerContext, "jsp");
        objectNode.put("success", true);
        return objectNode;
    }



    /* ==========================获取静态化数据=============================*/


    /**
     * 检查文件夹是否存在
     *
     * @param path
     */
    private void fileCheck(String path, String folderName) {
        path += File.separator + folderName;
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    /**
     * 静态化文章 处理content
     *
     * @param article
     * @return
     */
    public String[] getStaticArticleInfoArray(Article article) {
        Map<String, Object> params = new HashMap<>();
        StringBuffer sb = new StringBuffer();
        sb.append(article.getContent());
        params.put("aId", article.getId());
        List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId = :aId ORDER BY seq ASC", params);
        for (int i = 0; i < subArticles.size(); i++) {
            SubArticle subArticle = subArticles.get(i);
            sb.append(subArticle.getContent());
        }
        params.clear();
        params.put("content", sb.toString());

        String[] contens = null;
        Pattern r = Pattern.compile(KEY_WORD2);
        Matcher m = r.matcher(sb.toString());
        if (m.find()) {
            contens = sb.toString().split(KEY_WORD2);
        } else {
            contens = new String[]{sb.toString()};
        }

        return contens;
    }


    /**
     * 获取主/副导航数据
     *
     * @return
     */
    private String[] searchNav(String type) {
        int articleId;
        if ("main".equals(type)) {
            articleId = Constant.NAV_ID_MAIN;
        } else {
            articleId = Constant.NAV_ID_DEPUTY;
        }
        StringBuffer sb = new StringBuffer();
        Article article = find(Article.class, articleId);
        article.setStatus(9);
        update(article);
        sb.append(article.getContent());

        Map<String, Object> map = new HashedMap();
        map.put("aId", article.getId());

        List<SubArticle> subArticles = list(SubArticle.class, " WHERE aId=:aId ORDER BY seq ASC", map);

        for (SubArticle subList : subArticles) {
            sb.append(subList.getContent());
        }

        String[] results = sb.toString().split(",");

        return results;
    }

    /**
     * 获取广种福田数据
     *
     * @return
     */
    private String[] searchFutian() {
        StringBuffer sb = new StringBuffer();
        Map<String, Object> articleMap = new HashedMap();
        articleMap.put("cId", Constant.CATEGORY_ID_FUTIAN + "");

        Article article = list(Article.class, " WHERE cId = :cId", articleMap).get(0);

        sb.append(article.getTitle()).append(Constant.ARTICE_CONTENT_SPLICE).append(article.getContent());

        article.setStatus(Constant.ARTICLE_ID_NINE);
        article.setUpdateDate(new Date());
        update(article);

        Map<String, Object> map = new HashedMap();
        map.put("aId", article.getId());

        List<SubArticle> subArticles = list(SubArticle.class, " WHERE aId=:aId ORDER BY seq ASC", map);

        for (SubArticle subList : subArticles) {
            sb.append(subList.getContent());
        }

        // 广种福田
        String[] content = sb.toString().split(Constant.ARTICE_CONTENT_SPLICE);
        String[] result = new String[content.length];
        for (int i = 0; i < result.length; i++) {
            if (i < content.length) {
                result[i] = HtmlUtils.htmlUnescape(content[i].trim());
            } else {
                result[i] = "";
            }
        }

        return result;
    }

    /**
     * 获取 联系我们 数据
     *
     * @return
     */
    private List<String[]> searchContact() {
        StringBuffer sb = new StringBuffer();
        Map<String, Object> articleMap = new HashedMap();
        articleMap.put("cId", Constant.CATEGORY_ID_CONTACT + "");
        Article article = list(Article.class, " WHERE cId = :cId", articleMap).get(0);
        sb.append(article.getContent());

        Map<String, Object> map = new HashedMap();
        map.put("aId", article.getId());

        List<SubArticle> subArticles = list(SubArticle.class, " WHERE aId=:aId ORDER BY seq ASC", map);

        for (SubArticle subList : subArticles) {
            sb.append(subList.getContent());
        }
        article.setStatus(Constant.ARTICLE_ID_NINE);
        article.setUpdateDate(new Date());
        update(article);

        String[] content = sb.toString().split(Constant.ARTICE_CONTENT_SPLICE);
        List<String[]> resultList = new ArrayList<String[]>();
        String[] result;
        for (int i = 0; i < content.length; i++) {
            result = new String[2];
            String str = content[i];
            if (str.contains(",")) {
                // 包含 ,
                result[0] = str.split(",")[0].trim();
                result[1] = str.split(",")[1].trim();
            } else {
                result[0] = str.trim();
                result[1] = "";
            }

            resultList.add(result);
        }

        return resultList;
    }

    /**
     * 获取 紫云法务
     *
     * @return
     */
    private List<String[]> searchFawu() {
        List<String[]> resultList = new ArrayList<String[]>();

        Map<String, Object> params = new HashedMap();
        params.put("cId", Constant.CATEGORY_ID_LAW);

        List<Article> articles = list(Article.class, "WHERE cId = :cId ORDER BY orderBy ASC", params);

        for (int i = 0; i < articles.size(); i++) {
            StringBuffer contentSb = new StringBuffer();
            String[] result = new String[3];

            Article article = articles.get(i);
            result[0] = article.getTitle();
            result[1] = article.getUrl().contains("http") ? article.getUrl() : "";
            contentSb.append(article.getContent());
            params.clear();
            params.put("aId", article.getId());
            List<SubArticle> subArticleList = list(SubArticle.class, " WHERE aId=:aId ORDER BY seq ASC", params);

            for (int i1 = 0; i1 < subArticleList.size(); i1++) {

                SubArticle subArticle = subArticleList.get(i1);
                contentSb.append(subArticle.getContent());
            }
            result[2] = contentSb.toString();
            resultList.add(i, result);
        }
        return resultList;
    }

    /**
     * 获取 广告位
     *
     * @return
     */
    private List<Ad> searchAd() {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        List<Ad> list = new ArrayList<>();
        paramMap.put("status", Constant.ARTICLE_ID_NINE);
        paramMap.put("location_left", Constant.AD_LOCATION_LEFT);
        paramMap.put("location_right", Constant.AD_LOCATION_RIGHT);
        List<Ad> adList1 = list(Ad.class, " WHERE location = :location_left AND status = :status ORDER BY createDate DESC, updateDate DESC", paramMap);
        List<Ad> adList2 = list(Ad.class, " WHERE location = :location_right AND status = :status ORDER BY createDate DESC, updateDate DESC", paramMap);
        list.add(0, adList1.size() > 0 ? adList1.get(0) : null);
        list.add(1, adList2.size() > 0 ? adList2.get(0) : null);
        return list.size() >= 2 ? list : null;
    }

    /**
     * 获取 活动通知
     *
     * @return
     */
    private List<HeadLine> searchNotice() {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("different", Constant.GENERAL_ID_ONE);
        paramMap.put("cId", Constant.CATEGORY_ID_NOTICE);
        List<HeadLine> headLines = list(HeadLine.class, "WHERE STATUS=9 AND cId=:cId AND different=:different ORDER BY cateOrderBy ASC", paramMap);
        return headLines.size() > 0 ? headLines : null;
    }

    /**
     * 获取导航初始数据
     *
     * @param type
     * @return
     */
    public String[] searchNavReset(String type) {
        String[] navs = null;
        String templatePath = config.getArticleDir() + File.separator
                + "static" + File.separator + "html" + File.separator;

        String fileName = "";

        if ("main".equals(type)) {
            fileName = "nav.txt";
            navs = new String[8];
        } else if ("deputy".equals(type)) {
            fileName = "deputy.txt";
            navs = new String[3];
        }
        String filePath = templatePath + fileName;
        try {
            File file = new File(filePath);
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
            String row;
            int line = 0;
            while ((row = reader.readLine()) != null) {
                navs[line] = row;
                line++;
            }
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return navs;
    }

    /**
     * 文章静态化处理
     */
    public void articleStaticDispose(String[] contents, Category category, Article article, Map map,
                                     String staticResPrefix, ToolContext toolManagerContext, StringBuffer stringBuffer, String type) {
        staticResPrefix += "/";
        String pathTemp;
        Template template = find(Template.class, category.gettAId());
        String templatePath = "/base/" + template.getFileName();
        String articlePath;
        for (int i = 0; i < contents.length; i++) {
            map.put("content", contents[i]);

            // 获取文章路径
            if (!"preview".equals(type)) {
                articlePath = getArticlePathSuffix(category.geteName(), article.getId(), i == 0 ? "" : "_" + (i + 1), "");
            } else {
                articlePath = getArticlePreviewPathSuffix(category.geteName(), article.getId(), i == 0 ? "" : "_" + (i + 1));
            }

            // 页码
            StringBuffer pageNoSb = new StringBuffer();
            // 上一页
            if (i > 0) {

                if (!"preview".equals(type)) {
                    pathTemp = getArticlePathSuffix(category.geteName(), article.getId(), i > 1 ? "_" + i : "", "");
                } else {
                    pathTemp = getPreviewResultPathSuffix((config.getArticleIdAddend() + article.getId()) + (i > 1 ? "_" + i : ""));
                    staticResPrefix = "";
                }
                pageNoSb.append("<a href=\"" + staticResPrefix + pathTemp + "\">上一页</a>");
            }
            for (int k = 0; k < contents.length; k++) {
                // 页码显示
                if (contents.length > 1) {
                    if (i == k) {
                        pageNoSb.append("<span class=\"current\">" + (k + 1) + "</span>");
                    } else {
                        if (!"preview".equals(type)) {
                            pathTemp = getArticlePathSuffix(category.geteName(), article.getId(), k == 0 ? "" : "_" + (k + 1), "");
                        } else {
                            pathTemp = getPreviewResultPathSuffix((config.getArticleIdAddend() + article.getId()) + (k == 0 ? "" : "_" + (k + 1)));
                            staticResPrefix = "";
                        }
                        pageNoSb.append("<a href=\"" + staticResPrefix + pathTemp + "\">" + (k + 1) + "</a>");
                    }
                }
            }
            // 下一页
            if (contents.length > 1 && i != (contents.length - 1)) {

                if (!"preview".equals(type)) {
                    pathTemp = getArticlePathSuffix(category.geteName(), article.getId(), "_" + (i + 2), "");
                } else {
                    pathTemp = getPreviewResultPathSuffix((config.getArticleIdAddend() + article.getId()) + ("_" + (i + 2)));
                    staticResPrefix = "";
                }
                pageNoSb.append("<a href=\"" + staticResPrefix + pathTemp + "\">下一页</a>");

                // 阅读全文

                if (!"preview".equals(type)) {
                    pathTemp = getArticlePathSuffix(category.geteName(), article.getId(), "_1", "");
                } else {
                    pathTemp = getPreviewResultPathSuffix((config.getArticleIdAddend() + article.getId()) + "_1");
                    staticResPrefix = "";
                }
                pageNoSb.append("<a href=\"" + staticResPrefix + pathTemp + "\">浏览全文</a>");
            }

            map.put("pageContent", pageNoSb.toString());
            toolManagerContext.put("article", map);

            create(articlePath, templatePath, toolManagerContext, type);
        }

        if (contents.length > 1) {
            // 获取文章路径
            if (!"preview".equals(type)) {
                articlePath = getArticlePathSuffix(category.geteName(), article.getId(), "_1", "");
                pathTemp = getArticlePathSuffix(category.geteName(), article.getId(), "", "");
            } else {
                articlePath = getArticlePreviewPathSuffix(category.geteName(), article.getId(), "_1");
                pathTemp = getPreviewResultPathSuffix((config.getArticleIdAddend() + article.getId()) + "");
                staticResPrefix = "";
            }

            map.put("pageContent", "<a href=\"" + staticResPrefix + pathTemp + "\">返回</a>");
            map.put("content", stringBuffer.toString());
            toolManagerContext.put("article", map);
            create(articlePath, templatePath, toolManagerContext, type);
        }
    }

    /**
     * 获取分类中文名称
     *
     * @param id
     * @return
     */
    private String getCategoryEName(int id) {
        return find(Category.class, id).getName();
    }

    /**
     * 文章时间格式
     *
     * @param date
     * @return
     */
    private String getArticleDate(Date date) {
        return new SimpleDateFormat("MM-dd").format(date);
    }

    /**
     * 记录日志
     *
     * @param content
     */
    private long createPublishLog(long userId, String content) {
        PublishLog publishLog = new PublishLog();
        publishLog.setUserId(Integer.parseInt(userId + ""));
        publishLog.setCategory(content);
        publishLog.setStatus(1);
        publishLog.setRequestDate(new Date());

        return create(publishLog);
    }

    /**
     * 去掉文章中的空格换行符
     *
     * @param content
     * @return
     */
    public String contentReplace(String content) {
        Pattern p = Pattern.compile("\\s*|\t|\r|\n|<br />");
        Matcher m = p.matcher(content);
        content = m.replaceAll("");
        return content;
    }

    /**
     * 获取年份
     *
     * @return
     */
    public static String getThisYear() {
        return String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
    }

    /**
     * 获取后缀链接--不包含域名/本地路径
     *
     * @param category
     * @param aId
     * @return
     */
    public String getArticlePathSuffix(String category, long aId, String suffix, String base) {
        return base + category + "/" + getThisYear() + "/" + (config.getArticleIdAddend() + aId) + suffix + ".html";
    }

    /**
     * 获取预览后缀链接--不包含域名/本地路径
     *
     * @param category
     * @param aId
     * @return
     */
    public String getArticlePreviewPathSuffix(String category, long aId, String suffix) {
        return config.getPreviewDir() + "/" + getThisYear() + "/" + (config.getArticleIdAddend() + aId) + suffix + ".html";
    }

    /**
     * 获取预览path
     *
     * @param id
     * @return
     */
    public String getPreviewResultPathSuffix(String id) {
        String path = config.getPreViewDomain();
        path = path + "cn/article/preview?id=" + id;
        return path;
    }


    /**
     * 获取栏目列表链接
     *
     * @param id
     * @return
     */
    public String getCategoryList(long id) {
        String path = config.getListParam();
        path = path.replace("page", "1");
        return String.format(config.getListDomain() + path, id);
    }

}
