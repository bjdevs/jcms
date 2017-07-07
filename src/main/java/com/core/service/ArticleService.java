package com.core.service;

import com.core.domain.*;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import com.core.util.IpUtil;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by yk on 2017/5/3.
 */
@Service
public class ArticleService extends BaseService {

    @Autowired
    private GeneralArticleService generalArticleService;

    @Autowired
    private HomePageService homePageService;

    @Autowired
    private ArticleIndexService articleIndexService;

    private Log log;

    /**
     * 获取显示的数据
     *
     * @return
     */
    public ObjectNode list(String cName, int start, int limit, String idStr, String title, String startDate, String endDate) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("status", Constant.ARTICLE_ID_TEN);
        StringBuffer sql = new StringBuffer();
        sql.append("WHERE ");
        long cId;
        if ("recycle".equals(cName)) {
            sql.append("status >= :status");
        } else if ("all".equals(cName)) {
            // 显示全部文章
            sql.append(" id > 7");
            sql.append(" AND status < :status");
        } else {
            cId = getCategoryId(cName, false);
            if (cId == 0) {
                return null;
            }
            param.put("cId", cId);
            sql.append("cId = :cId AND status < :status");
        }

        if (!StringUtils.isBlank(idStr)) {
            param.put("id", idStr);
            sql.append(" AND id = :id");
        }
        if (!StringUtils.isBlank(title)) {
            sql.append(" AND title like '%" + title + "%'");
        }
        if (!StringUtils.isBlank(startDate) && !StringUtils.isBlank(endDate)) {
            param.put("start", startDate);
            param.put("end", endDate);
            sql.append(" AND createDate BETWEEN :start AND :end");
        }

        sql.append(" ORDER BY updateDate DESC, createDate DESC");

        int count = count(Article.class, " " + sql.toString(), param);

        ObjectNode objectNode = objectMapper.createObjectNode();
        sql.append(" LIMIT :start, :limit");
        param.put("start", start);
        param.put("limit", limit);
        List<Article> articles = list(Article.class, sql.toString(), param);
        ArrayNode arrayNode = objectMapper.createArrayNode();
        try {
            for (int i = 0; i < articles.size(); i++) {
                Article article = articles.get(i);
                StringBuffer sb = new StringBuffer();
                sb.append(article.getContent());
                List<SubArticle> subArticles = list(SubArticle.class, " WHERE aId=" + article.getId() + " ORDER By seq ASC");
                for (int k = 0; k < subArticles.size(); k++) {
                    sb.append(subArticles.get(k).getContent());
                }
                article.setContent(sb.toString());
                ObjectNode jsonNodes = objectMapper.valueToTree(article);
                jsonNodes.put("creator", getCreator(article.getuId()));
                jsonNodes.put("category", getCategory(article.getcId()));
                arrayNode.add(jsonNodes);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("rows", arrayNode);
        objectNode.put("total", count);

        return objectNode;
    }

    /**
     * 查询头条
     *
     * @param cName
     * @param type
     * @return
     */
    public ObjectNode headLineList(String cName, String type, int start, int limit) {

        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> param = new HashMap<String, Object>();
        long id = getCategoryId(cName, false);
        /*if (id == 0) {
            return null;
        }*/
        StringBuffer sql = new StringBuffer();
        int different = "text".equals(type) ? 1 : 2;
        sql.append(" WHERE cId = :cId AND different = :different ")
//                .append("ORDER BY cateOrderBy ASC, updateDate DESC, createDate DESC ");
                .append("ORDER BY IF(cateOrderBy=0,100,cateOrderBy) ASC, updateDate DESC, createDate DESC ");
        param.put("cId", id);
        param.put("different", different);
        int count = count(HeadLine.class, sql.toString(), param);
        param.put("start", start);
        param.put("limit", limit);
        sql.append(" LIMIT :start, :limit ");
        List<HeadLine> headLines = list(HeadLine.class, sql.toString(), param);

        ObjectNode objectNode1;
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (int i = 0; i < headLines.size(); i++) {
            HeadLine headLine = headLines.get(i);
            objectNode1 = objectMapper.valueToTree(headLine);
            objectNode1.put("creator", getCreator(headLine.getuId()));
            objectNode1.put("category", getCategory(headLine.getcId()));
            long mId = headLine.getmId();
            if (mId != 0) {
                Media media = find(Media.class, mId);
                objectNode1.put("mediaName", media.getTitle());
                objectNode1.put("mediaUrl", media.getUrl());
            }

            Article article = find(Article.class, headLine.getaId());
            objectNode1.put("categoryArticle", getCategory(article.getcId()));
            arrayNode.add(objectNode1);
        }
        objectNode.put("rows", arrayNode);
        objectNode.put("total", count);
        return objectNode;
    }

    /**
     * 查询aId所有头条
     *
     * @param aId
     * @return
     */
    public ObjectNode headLineForId(long aId, String type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        int different = "text".equals(type) ? 1 : 2;
        Map<String, Object> params = new HashMap<>();
        params.put("aId", aId);
        params.put("different", different);
        List<HeadLine> headLines = list(HeadLine.class, " WHERE aId = :aId AND different = :different ORDER BY cateOrderBy ASC, createDate DESC, updateDate DESC", params);
        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode objectNodeOne;
        HeadLine headLine;
        for (int i = 0; i < headLines.size(); i++) {
            headLine = headLines.get(i);
            objectNodeOne = objectMapper.valueToTree(headLine);
            objectNodeOne.put("category", getCategory(headLine.getcId()));
            objectNodeOne.put("creator", getCreator(headLine.getuId()));
            arrayNode.add(objectNodeOne);
        }
        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 新增文章
     *
     * @param request
     * @return
     */
    public ObjectNode createArticle(HttpServletRequest request) {

        ObjectNode objectNode = objectMapper.createObjectNode();
        String type = "新增";

        String title = request.getParameter("title");
        String source = request.getParameter("source");
        String author = request.getParameter("author");
        if (author.length() == 0) {
            author = request.getParameter("authorStr");
        }
        String depict = request.getParameter("depict");
        String[] kIds = request.getParameterValues("kId");
        String sId = request.getParameter("sId");
        String category = request.getParameter("category");
        String content = request.getParameter("content");
        String userId = request.getParameter("userId");
        String articleIdStr = request.getParameter("articleId");

        int categoryId = getCategoryIdForStr(category);
        String[] contentArray = builderContentArray(content);
        if (contentArray.length < 1) {
            objectNode.put("result", "contentLength error");
            objectNode.put("success", false);
            return objectNode;
        }
        source = (null == source || "".equals(source)) ? "黄梅老祖寺" : source;

        Article article = new Article();

        article.setuId(Integer.parseInt(userId));
        article.setAuthor(author);
        article.setSource(source);
        article.setTitle(title);
        article.setDepict(depict);
        article.setContent(contentArray[0]);
        // 连载Id，默认为 0
        article.setsId(StringUtils.isBlank(sId) ? 0 : Integer.parseInt(sId));
        // 需要一个模版Id
        article.settId(0);
        article.sethAId(0);
        article.sethPId(0);
        article.setcId(categoryId);
        article.setStatus(Constant.ARTICLE_ID_ZERO);
        article.setCreateDate(new Date());
        article.setUpdateDate(new Date());

        long articleId = 0;
        if (!StringUtils.isBlank(articleIdStr)) {
            type = "更新";
            articleId = Long.parseLong(articleIdStr);
            article.setId(articleId);
            article.setUpdateDate(new Date());
            update(article);
            List<HeadLine> headLines = list(HeadLine.class, " WHERE aId = " + articleId);
            for (int i = 0; i < headLines.size(); i++) {
                delete(HeadLine.class, headLines.get(i).getId());
            }
        } else {
            articleId = create(article);
        }

        int count = 1;
        if (articleId > 0) {
            List<ArticleKeyWord> articleKeyWords = list(ArticleKeyWord.class, " WHERE aId = " + articleId);
            for (int i = 0; i < articleKeyWords.size(); i++) {
                delete(ArticleKeyWord.class, articleKeyWords.get(i).getId());
            }
            for (String idStr : kIds) {
                ArticleKeyWord articleKeyWord = new ArticleKeyWord();
                articleKeyWord.setaId(Integer.parseInt(articleId + ""));
                int keyId = 0;
                if (isNumeric(idStr)) {
                    keyId = Integer.parseInt(idStr);
                    generalArticleService.updateKeyWordToCount(Long.parseLong(idStr));
                } else {
                    long id = 0;
                    Map<String, Object> params = new HashMap<>();
                    params.put("name", idStr);
                    List<KeyWord> keyWords = list(KeyWord.class, "WHERE name = :name", params);
                    if (keyWords.size() > 0) {
                        id = keyWords.get(0).getId();
                    } else {
                        id = generalArticleService.createKeyWord(idStr);
                    }
                    keyId = Integer.parseInt(id + "");
                }
                articleKeyWord.setkId(keyId);
                articleKeyWord.setOrderBy(count);
                create(articleKeyWord);
                count++;
            }
        }

        createBaseLog("文章管理", type, type + "文章ID: " + articleId + " 、标题：" + title);

        if (articleId > 0) {
            createSubArticleForContents(articleId, contentArray);

            objectNode.put("result", "success");
            objectNode.put("success", true);

            return objectNode;
        } else {
            objectNode.put("result", "Create Article Error，Content length is empty");
            objectNode.put("success", false);
            return objectNode;
        }

    }

    /**
     * 预览文章
     *
     * @param id
     * @return
     */
    public ObjectNode articlePreview(long id) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        String path = homePageService.articlePublish(id, "preview");

        if (path.length() > 0) {
            objectNode.put("success", true);
            objectNode.put("preview", path);
        } else {
            objectNode.put("success", true);
        }
        return objectNode;
    }

    /**
     * 修改文章状态
     *
     * @param type
     * @return
     */
    public ObjectNode updateArticleStatus(String type, String[] ids) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        int num = 0;
        String log_action = null;
        boolean success = true;
        try {
            if ("release".equals(type)) {
                // 发布
                log_action = "发布";
                for (int i = 0; i < ids.length; i++) {
                    long id = Long.parseLong(ids[i]);
                    Article article = find(Article.class, id);
                    if (null != article) {
                        if (article.getStatus() == Constant.ARTICLE_ID_ONE) {
                            String path = homePageService.articlePublish(id, null);
                            article.setUrl(path);
                            article.setStatus(Constant.ARTICLE_ID_NINE);
                            article.setPublishDate(new Date());
                            update(article);
                            List<HeadLine> headLines = list(HeadLine.class, String.format(" WHERE uId = 0 AND status = 0 AND aId = %s ", article.getId()));
                            for (int k = 0; k < headLines.size(); k++) {
                                HeadLine headLine = headLines.get(k);
                                headLine.setStatus(Constant.ARTICLE_ID_NINE);
                                update(headLine);
                            }
                            objectNode.put("status", article.getStatus());
                            objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
                        } else {
                            objectNode.put("success", "error");
                            return objectNode;
                        }
                    }
                }
                articleIndexService.updateIndex(ids);

            } else {
                for (int i = 0; i < ids.length; i++) {
                    long id = Long.parseLong(ids[i]);
                    num = getArticleStatusStr(type, id);
                    Article article = find(Article.class, id);
                    if (null != article) {
                        article.setStatus(num);
                        article.setUpdateDate(new Date());
                        update(article);

                        // 文章返工 撤下头条
                        if (num == Constant.ARTICLE_ID_FIVE) {
                            repealHeadline(article.getId());
                        }
                        // 删除文章静态文件
                        if (num == 19) {
                            // 删除文章索引，必须放在删除目录方法上面
                            articleIndexService.deleteArticle(article);
                            removeArticleFile(article.getId());
                        }
                    }
                    switch (type) {
                        case "audit":
                            log_action = "审核";
                            break;
                        case "rework":
                            log_action = "返工";
                            break;
                        case "move":
                            log_action = "移动";
                            break;
                        case "delete":
                            log_action = "删除";
                            break;
                        case "release":
                            log_action = "发布";
                            break;
                        case "restore":
                            log_action = "还原";
                            break;
                    }
                }
            }
            createBaseLog("文章管理", log_action, "操作ID：" + Arrays.toString(ids));
        } catch (Exception e) {
            e.printStackTrace();
            success = false;
            objectNode.put("msg", e.getMessage());
        }
        objectNode.put("success", success);
        return objectNode;
    }

    /**
     * 修改文章分类
     *
     * @param category
     * @param ids
     * @return
     */
    public ObjectNode updateArticleCategory(String category, String[] ids) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        int categoryId = getCategoryIdForStr(category);
        String category_type = null;

        for (int i = 0; i < ids.length; i++) {
            long id = Long.parseLong(ids[i]);
            Article article = find(Article.class, id);
            Category category1 = find(Category.class, article.getcId());
            category_type = category1.geteName() + " --> " + category;
            if (null != article) {
                article.setcId(categoryId);
                article.setUpdateDate(new Date());
                update(article);
            }
        }
        createBaseLog("文章管理", "移动", "修改文章分类[" + category_type + "]：" + Arrays.toString(ids));
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 查询 标签
     *
     * @return
     */
    public ObjectNode keyWordList(String type, int start, int limit) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> params = new HashMap<>();
        int minLimit = 0;
        int maxLimit = 10;
        StringBuffer sb = new StringBuffer();
        sb.append(" ORDER BY");
        params.put("minLimit", minLimit);
        params.put("maxLimit", maxLimit);
        int count = 0;
        if ("list".equals(type)) {
            // 列表
            sb.append(" updateDate DESC, createDate DESC");
            params.clear();
            params.put("start", start);
            params.put("limit", limit);
            count = count(KeyWord.class, sb.toString(), params);
            sb.append(" LIMIT :start, :limit ");
        } else if ("hot".equals(type)) {
            // 热门
            sb.append(" COUNT DESC, updateDate DESC LIMIT :minLimit, :maxLimit");
        }

        List<KeyWord> keyWords = list(KeyWord.class, sb.toString(), params);
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (int i = 0; i < keyWords.size(); i++) {
            KeyWord keyWord = keyWords.get(i);
            arrayNode.add(objectMapper.valueToTree(keyWord));
        }

        objectNode.put("rows", arrayNode);
        objectNode.put("total", count);

        return objectNode;
    }

    /**
     * 修改 标签
     *
     * @param data
     * @return
     */
    public ObjectNode updateKeyWord(String data, String[] ids) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode;
        if (!StringUtils.isBlank(data)) {
            try {
                arrayNode = objectMapper.readValue(data, ArrayNode.class);
                for (int i = 0; i < arrayNode.size(); i++) {
                    KeyWord keyWord = objectMapper.readValue(arrayNode.get(i), KeyWord.class);
                    keyWord.setUpdateDate(new Date());
                    update(keyWord);
                }
                objectNode.put("success", true);
            } catch (IOException e) {
                objectNode.put("success", false);
            }
        } else if (ids.length > 0) {
            for (int i = 0; i < ids.length; i++) {
                long id = Long.parseLong(ids[i]);
                delete(KeyWord.class, id);
            }
            objectNode.put("success", true);
        }

        createBaseLog("标签管理", "更新", Arrays.toString(ids));

        return objectNode;
    }

    /**
     * 新增keyword
     *
     * @param request
     * @return
     */
    public ObjectNode createKeyWord(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        String name = request.getParameter("name");
        String depict = request.getParameter("depict");

        KeyWord keyWord = new KeyWord();
        keyWord.setName(name);
        keyWord.setDepict(depict);
        keyWord.setCount(0);
        keyWord.setCreateDate(new Date());
        create(keyWord);

        objectNode.put("success", true);

        createBaseLog("标签管理", "新增", keyWord.toString());

        return objectNode;
    }

    /**
     * 查询 category
     *
     * @return
     */
    public ObjectNode categoryList(int start, int limit) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        Map<String, Object> params = new HashMap<>();
        params.put("start", start);
        params.put("limit", limit);
        List<Category> categories = list(Category.class, " WHERE status > 0 LIMIT :start, :limit", params);
        int count = count(Category.class, " WHERE status > 0");
        ObjectNode objectNode1;
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            objectNode1 = objectMapper.valueToTree(category);
            objectNode1.put("path", "/" + category.geteName() + "/");
            objectNode1.put("category_template", getTemplateTypeForId(category.gettId()));
//            objectNode1.put("article_template", getTemplateNameForId(category.gettAId()));
            arrayNode.add(objectNode1);
        }
        objectNode.put("rows", arrayNode);
        objectNode.put("total", count);
        return objectNode;
    }

    /**
     * 目录模版保存处理
     *
     * @param method
     * @param data
     * @return
     */
    public ObjectNode categoryBtn(String method, String data) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode;
        if ("save".equals(method) && !StringUtils.isBlank(data)) {
            try {
                arrayNode = objectMapper.readValue(data, ArrayNode.class);
                for (int i = 0; i < arrayNode.size(); i++) {
                    // 包含 "path":"/焦点图/","category_template":"栏目模板"
                    JsonNode jsonNode = arrayNode.get(i);
                    Category category = new Category();
                    category.setId(Long.parseLong(jsonNode.get("id").toString()));
                    String name = jsonNode.get("name").toString();
                    String eName = jsonNode.get("eName").toString();
                    if (name.contains("\"")) {
                        name = name.replaceAll("\"", "").trim();
                    }
                    if (eName.contains("\"")) {
                        eName = eName.replaceAll("\"", "").trim();
                    }
                    category.seteName(eName);
                    category.setName(name);
                    category.setParentId(Integer.parseInt(jsonNode.get("parentId").toString()));
                    category.settId(Integer.parseInt(jsonNode.get("tId").toString()));
                    category.settAId(Integer.parseInt(jsonNode.get("tAId").toString()));
                    category.setStatus(Integer.parseInt(jsonNode.get("status").toString()));
                    String date = jsonNode.get("createDate").toString();
                    if (date.contains("\"")) {
                        date = date.replaceAll("\"", "").trim();
                    }
                    category.setCreateDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date));
                    category.setUpdateDate(new Date());
                    update(category);
                    createBaseLog("模版管理", "更新", "栏目模版修改：" + category.toString());
                }

                objectNode.put("success", true);
            } catch (Exception e) {
                e.printStackTrace();
                objectNode.put("success", false);
            }
        }

        return objectNode;
    }

    /**
     * 查询 category
     *
     * @return
     */
    public ObjectNode categoryENameList() {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        List<Category> categories = list(Category.class, " WHERE status > 0 ORDER BY status ASC");
        ObjectNode objectNode1;
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            objectNode1 = objectMapper.valueToTree(category);
            arrayNode.add(objectNode1);
        }
        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 移动 -- 获取category
     * @return
     */
    public ObjectNode categoryENameListForMove() {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        List<Category> categories = list(Category.class, " WHERE status > 2 ORDER BY status ASC");
        ObjectNode objectNode1;
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
//            objectNode1 = objectMapper.valueToTree(category);
            objectNode1 = objectMapper.createObjectNode();
            objectNode1.put("viewType", "content-"+category.geteName());
            objectNode1.put("text", category.getName());
            objectNode1.put("split", "true");
            objectNode1.put("checked", false);
            objectNode1.put("leaf", true);
            objectNode1.put("name", "category");
            arrayNode.add(objectNode1);

        }
        objectNode.put("children", arrayNode);
        return objectNode;
    }


    /**
     * 查询 Template
     *
     * @return
     */
    public ObjectNode templateList(int start, int limit) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        List<Template> templates = list(Template.class, "ORDER BY updateDate DESC, createDate DESC LIMIT " + start + ", " + limit);
        int count = count(Template.class, " ORDER BY updateDate DESC, createDate DESC");
        for (int i = 0; i < templates.size(); i++) {
            Template template = templates.get(i);
            arrayNode.add(objectMapper.valueToTree(template));
        }
        objectNode.put("rows", arrayNode);
        objectNode.put("total", count);
        return objectNode;
    }

    /**
     * 用于查询指定类型的template
     *
     * @param type
     * @return
     */
    public ObjectNode templateListForId(int type) {
        ObjectNode objectNode1 = objectMapper.createObjectNode();

        Map<String, Object> params = new HashMap<>();
        params.put("type", type);

        List<Template> templates = list(Template.class, " WHERE type = :type ORDER BY updateDate DESC, createDate DESC", params);
        ArrayNode arrayNode = objectMapper.createArrayNode();

        for (int i = 0; i < templates.size(); i++) {
            arrayNode.add(objectMapper.valueToTree(templates.get(i)));
        }

        objectNode1.put("rows", arrayNode);
        return objectNode1;
    }

    /**
     * 返回单个文章
     *
     * @return
     */
    public ObjectNode getArticleForId(long id) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        Article article = find(Article.class, id);
        StringBuffer contentSb = new StringBuffer();

        if (null != article) {
            contentSb.append(article.getContent());

            Map<String, Object> params = new HashMap<>();
            params.put("aId", article.getId());
            List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId = :aId ORDER BY seq ASC", params);
            for (int i = 0; i < subArticles.size(); i++) {
                SubArticle subArticle = subArticles.get(i);
                contentSb.append(subArticle.getContent());
            }

            if (id == 3) { // 广种福田
                String[] fuTians = contentSb.toString().split(Constant.ARTICE_CONTENT_SPLICE);
                objectNode.put("depict", fuTians.length >= 0 ? fuTians[0] : "");
                objectNode.put("use", fuTians.length >= 1 ? fuTians[1] : "");
                objectNode.put("bank", fuTians.length >= 2 ? fuTians[2] : "");
                objectNode.put("user", fuTians.length >= 3 ? fuTians[3] : "");
                objectNode.put("card", fuTians.length >= 4 ? fuTians[4] : "");
                return objectNode;
            }
            if (id == 4) { // 联系我们
                String[] contacts = contentSb.toString().split(Constant.ARTICE_CONTENT_SPLICE);
                ArrayNode arrayNode = objectMapper.createArrayNode();
                ObjectNode objectNode1;
                for (int i = 1; i < contacts.length; i++) {
                    objectNode1 = objectMapper.createObjectNode();

                    String[] infoSplit = contacts[i].split(",");

                    String infoKey = infoSplit.length >= 0 ? infoSplit[0] : "";
                    String infoVaule = infoSplit.length >= 1 ? infoSplit[1] : "";
                    objectNode1.put("id", i);
                    objectNode1.put("key", infoKey);
                    objectNode1.put("value", infoVaule);

                    arrayNode.add(objectNode1);
                }
                objectNode.put("rows", arrayNode);
                return objectNode;
            }

            article.setContent(contentSb.toString());
            objectNode = objectMapper.valueToTree(article);
        }

        return objectNode;
    }

    /**
     * 返回单个内嵌文章
     *
     * @param id
     * @return
     */
    public ObjectNode articleEmbedForId(long id) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Article article = find(Article.class, id);
        StringBuffer contentSb = new StringBuffer();

        if (null != article) {
            contentSb.append(article.getContent());

            Map<String, Object> params = new HashMap<>();
            params.put("aId", article.getId());
            List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId = :aId ORDER BY seq ASC", params);
            for (int i = 0; i < subArticles.size(); i++) {
                SubArticle subArticle = subArticles.get(i);
                contentSb.append(subArticle.getContent());
            }
        }
        objectNode.put("content", contentSb.toString());
        return objectNode;
    }


    /**
     * 用于修改导航、...
     *
     * @param id
     * @param content
     * @return
     */
    public ObjectNode updateArticleForId(long id, String content) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        content = content.replaceAll("</li>\n\r*", "</li>,");
//        content = content.substring(0, content.lastIndexOf(","));

        String[] contents = builderContentArray(content);
        if (contents.length > 0) {
            Article article = find(Article.class, id);
            article.setContent(contents[0]);
            article.setUpdateDate(new Date());
            article.setStatus(5);
            update(article);
            // 调用文章处理
            disposeSubArticle(id, contents);
            objectNode.put("status", article.getStatus());
            objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
            createBaseLog("内嵌管理", "更新", "更新导航");
        }
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 用于修改紫云法务
     *
     * @param id
     * @param content
     * @return
     */
    public ObjectNode updateEmbedForId(long id, String content) {
        ObjectNode objectNode = objectMapper.createObjectNode();
//        content = content.replaceAll("\n\r*", " ");
        String[] contents = builderContentArray(content);
        Article article = null;
        if (contents.length > 0) {
            article = find(Article.class, id);
            article.setContent(contents[0]);
            article.setStatus(Constant.ARTICLE_ID_FIVE);
            article.setUpdateDate(new Date());
            update(article);
            disposeSubArticle(id, contents);
            objectNode.put("status", article.getStatus());
            objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
            createBaseLog("内嵌管理", "更新", "更新紫云法务");
        }
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 修改广种福田
     *
     * @param request
     * @return
     */
    public ObjectNode updataFutian(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String depict = request.getParameter("depict");
        String use = request.getParameter("use");
        String bank = request.getParameter("bank");
        String user = request.getParameter("userStr");
        String card = request.getParameter("card");

        StringBuffer contentSb = new StringBuffer();
        contentSb.append(depict).append(Constant.ARTICE_CONTENT_SPLICE)
                .append(use).append(Constant.ARTICE_CONTENT_SPLICE)
                .append(bank).append(Constant.ARTICE_CONTENT_SPLICE)
                .append(user).append(Constant.ARTICE_CONTENT_SPLICE)
                .append(card);

        String[] content = builderContentArray(contentSb.toString());

        Article article = find(Article.class, 3);
        article.setContent(content[0]);
        article.setUpdateDate(new Date());
        article.setStatus(Constant.ARTICLE_ID_FIVE);
        update(article);

        createSubArticleForContents(3, content);

        objectNode.put("status", article.getStatus());
        objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
        objectNode.put("success", true);
        createBaseLog("内嵌管理", "更新", "更新广种福田");
        return objectNode;
    }

    /**
     * 修改 联系我们
     *
     * @param request
     * @return
     */
    public ObjectNode updateContact(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        String contactId = request.getParameter("contactId");
        String contactKey = request.getParameter("contactKey");
        String contactValue = request.getParameter("contactValue");

        Article article = find(Article.class, 4);
        String[] contents = article.getContent().split(Constant.ARTICE_CONTENT_SPLICE);

        String updateContent = contactKey + "," + contactValue;

        int id = Integer.parseInt(contactId);

        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < contents.length; i++) {
            if (i == id) {
                contents[i] = updateContent;
            }
            if (i == contents.length - 1) {
                sb.append(contents[i]);
            } else {
                sb.append(contents[i]).append(Constant.ARTICE_CONTENT_SPLICE);
            }
        }
        article.setContent(sb.toString());
        article.setUpdateDate(new Date());
        article.setStatus(Constant.ARTICLE_ID_FIVE);
        update(article);
        objectNode.put("success", true);
        objectNode.put("status", article.getStatus());
        objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
        createBaseLog("内嵌管理", "更新", "更新联系我们");
        return objectNode;
    }

    /**
     * 首页显示总数
     *
     * @return
     */
    public ObjectNode getFileInfo() {
        ObjectNode objectNode = objectMapper.createObjectNode();

        int articleCount = count(Article.class, " WHERE id > 7");
        int picCount = count(Media.class, " WHERE type = " + Constant.MEDIA_TYPE_PICTURE);
        int audioCount = count(Media.class, " WHERE type = " + Constant.MEDIA_TYPE_AUDIO);
        objectNode.put("article", articleCount);
        objectNode.put("picture", picCount);
        objectNode.put("voice", audioCount);
        return objectNode;
    }

    /**
     * 修改文章
     *
     * @return
     */
    public ObjectNode updateArticle() {
        ObjectNode objectNode1 = objectMapper.createObjectNode();

        String id = request.getParameter("id");
        String title = request.getParameter("title");
        String author = request.getParameter("author");
        String[] kIds = request.getParameterValues("kIds");
        String[] sIds = request.getParameterValues("sIds");
        String depict = request.getParameter("depict");
        String content = request.getParameter("content");
        String account = request.getParameter("account");
        int sId = 0;
        String sName = "未连载";

        if (null != sIds && sIds.length > 0){
            String sIdStr = sIds[0];
            if (null != sIdStr && !"".equals(sIdStr)){
                sId = Integer.parseInt(sIds[0]);
                Serial serial = find(Serial.class, sId);
                sName = serial.getName();
            }
        }

        String cName = "";

        Article article = find(Article.class, Long.parseLong(id));
        if (null != article) {
            article.setTitle(title);
            article.setAuthor(author);
            article.setDepict(depict);
            article.setsId(sId);
            String[] contents = builderContentArray(content);
            article.setContent(contents[0]);
            article.setUpdateDate(new Date());
            int status = article.getStatus();
            if (status == Constant.ARTICLE_ID_NINE || status == Constant.ARTICLE_ID_ONE) {
                article.setStatus(Constant.ARTICLE_ID_FIVE);
            }
            update(article);
            disposeSubArticle(Long.parseLong(id), contents);
            // 撤销头条
            repealHeadline(article.getId());

            Map<String, Object> params = new HashedMap();
            params.put("aId", article.getId());
            List<ArticleKeyWord> keyWords = list(ArticleKeyWord.class, " WHERE aId = :aId", params);
            for (int i = 0; i < keyWords.size(); i++) {
                delete(ArticleKeyWord.class, keyWords.get(i).getId());
            }

            for (int i = 0; i < kIds.length; i++) {
                String kIdStr = kIds[i];
                ArticleKeyWord articleKeyWord = new ArticleKeyWord();
                articleKeyWord.setaId(Integer.parseInt(article.getId() + ""));
                if (isNumeric(kIdStr)) {
                    long kId = Long.parseLong(kIdStr);
                    KeyWord keyWord = find(KeyWord.class, kId);
                    if (null != keyWord) {
                        articleKeyWord.setkId((int) kId);
                        cName += keyWord.getName() + ",";
                    }
                } else {
                    params.clear();
                    params.put("name", kIdStr);
                    List<KeyWord> keyWords1 = list(KeyWord.class, " WHERE name = :name", params);
                    if (keyWords1.size() > 0) {
                        articleKeyWord.setkId(Integer.parseInt(keyWords1.get(0).getId() + ""));
                        cName += keyWords1.get(0).getName() + ",";
                    }
                }
                articleKeyWord.setOrderBy(i);
                create(articleKeyWord);
            }
        }

        createBaseLog("文章管理", "更新", "被修改文章ID：" + article.getId());
        objectNode1.put("cName", cName.substring(0, cName.length() - 1));
        objectNode1.put("sName", sName);
        objectNode1.put("success", true);
        return objectNode1;
    }

    /**
     * 审核文章
     *
     * @param id
     * @return
     */
    public ObjectNode auditArticleForId(long id) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Article article = find(Article.class, id);
        try {
            if (null != article) {
                if (article.getStatus() == Constant.ARTICLE_ID_FIVE) {
                    article.setStatus(Constant.ARTICLE_ID_ONE);
                    article.setUpdateDate(new Date());
                    update(article);
                    objectNode.put("success", true);
                    objectNode.put("status", article.getStatus());
                    objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
                } else {
                    objectNode.put("success", "error");
                }
            }
        } catch (Exception e) {
            objectNode.put("success", false);
        }
        createBaseLog("文章管理", "审核", "审核的文章ID：" + article.getId());
        return objectNode;
    }

    /**
     * 获取内嵌状态
     *
     * @param id
     * @return
     */
    public ObjectNode getEmbedInfo(long id) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        Article article = find(Article.class, id);
        if (null != article) {
            int status = article.getStatus();

            objectNode.put("statusStr", status);
            objectNode.put("updateDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(article.getUpdateDate()));
        }

        return objectNode;
    }

    /**
     * 发布记录
     *
     * @return
     */
    public ObjectNode publishList(int page, int limit) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Page<PublishLog> publishLogPage = getPage(PublishLog.class, " ORDER BY requestDate DESC, finishDate DESC", null, limit, page);
        List<PublishLog> publishLogs = publishLogPage.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode objectNode1;
        for (int i = 0; i < publishLogs.size(); i++) {
            PublishLog publishLog = publishLogs.get(i);
            objectNode1 = objectMapper.valueToTree(publishLog);
            objectNode1.put("user", getCreator(publishLog.getUserId()));
            arrayNode.add(objectNode1);
        }

        objectNode.put("total", publishLogPage.getTotalData());
        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 创建头条
     *
     * @return
     */
    public ObjectNode createHeadLine(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String log_content = null;
        String id = request.getParameter("id");
        String type = request.getParameter("type");
        String imageUpload = request.getParameter("imageUpload");
        String userId = request.getParameter("userId");
        int mId = 0;
        if (type.equals("2")) {
            if (StringUtils.isBlank(imageUpload)) {
                objectNode.put("success", false);
                objectNode.put("msg", "头条图片不能为空");
                return objectNode;
            }
            Map<String, Object> params = new HashMap<>();
            params.put("url", imageUpload);
            List<Media> medias = list(Media.class, " WHERE url = :url", params);

            mId = medias.size() > 0 ? Integer.parseInt(medias.get(0).getId() + "") : 0;
        }
        String topTitle = request.getParameter("topTitle");
        String redStatus = request.getParameter("redStatus");
        String categoryName = request.getParameter("categoryName");

        if (StringUtils.isBlank(categoryName)) {
            objectNode.put("success", false);
            return objectNode;
        }

        if (null == id) {
            return null;
        }

        String[] categorys = null;
        if (categoryName.contains(",")) {
            categorys = categoryName.split(",");
        } else {
            categorys = new String[]{categoryName};
        }

        for (int i = 0; i < categorys.length; i++) {
            String category = categorys[i];
            if (null != category && category.length() > 0) {
                int cId = Integer.parseInt(category);
                HeadLine headLine = new HeadLine();

                headLine.setuId(Integer.parseInt(userId));

                headLine.setaId(Integer.parseInt(id));
                headLine.setName(topTitle);
                headLine.setCreateDate(new Date());
                headLine.setRedStatus(null != redStatus ? Integer.parseInt(redStatus) : 0);
                headLine.setcId(cId);
                headLine.setStatus(9);
                headLine.setCateOrderBy(0);
                headLine.setmId(mId);
                headLine.setDifferent(Integer.parseInt(type));
                headLine.setUpdateDate(new Date());
                long headId = create(headLine);
                Article article = find(Article.class, Integer.parseInt(id));
                if ("1".equals(type)) {
                    log_content = "新增文字头条，文章ID：" + id;
                    article.sethAId(Integer.parseInt(headId + ""));
                } else {
                    log_content = "新增图片头条，文章ID：" + id;
                    article.sethPId(Integer.parseInt(headId + ""));
                }
                article.setUpdateDate(new Date());
                update(article);
            }
        }
        createBaseLog("头条管理", "新增", log_content);
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 获取媒体图片
     *
     * @return
     */
    public ObjectNode mediaList() {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ObjectNode objectNode1;
        ArrayNode arrayNode = objectMapper.createArrayNode();
        List<Media> medias = list(Media.class, "WHERE status=1 ORDER BY createDate DESC");
        for (int i = 0; i < medias.size(); i++) {
            objectNode1 = objectMapper.valueToTree(medias.get(i));
            arrayNode.add(objectNode1);
        }

        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 获取重置导航数据
     *
     * @param type
     * @return
     */
    public Object resetNav(String type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String[] navs = homePageService.searchNavReset(type);
        StringBuffer sb = new StringBuffer();
        for (String nav : navs) {
            sb.append(nav).append("\n");
        }
        objectNode.put("success", true);
        objectNode.put("nav", sb.toString());
        return objectNode;
    }


    /**
     * 修改头条
     *
     * @return
     */
    public ObjectNode updateHeadLine(String data) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        try {
            ArrayNode arrayNode = objectMapper.readValue(data, ArrayNode.class);
            User user = (User) request.getAttribute("user");
            for (int i = 0; i < arrayNode.size(); i++) {
                JsonNode jsonNode = arrayNode.get(i);
                long hid = Long.parseLong(jsonNode.get("id").toString());
                HeadLine headLine = find(HeadLine.class, hid);
                String hName = jsonNode.get("name").toString();
                if (hName.contains("\"")) {
                    hName = hName.replace("\"", "").trim();
                }
                headLine.setName(hName);
                headLine.setuId(Integer.parseInt(user.getId() + ""));
                headLine.setCateOrderBy(Integer.parseInt(jsonNode.get("cateOrderBy").toString()));
                headLine.setStatus(Integer.parseInt(jsonNode.get("status").toString()));
                headLine.setUpdateDate(new Date());
                int redStatusFind = 0;
                String red = jsonNode.get("redStatus").toString();
                boolean temp = isNumeric(red);
                if (!temp) {
                    redStatusFind = red.equals("true") ? 1 : 0;
                } else {
                    redStatusFind = Integer.parseInt(red);
                }
                headLine.setRedStatus(redStatusFind);
                update(headLine);
                createBaseLog("头条管理", "更新", "更新头条ID：" + headLine.getId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            objectNode.put("success", false);
            objectNode.put("msg", e.getMessage());
        }

        objectNode.put("success", true);

        return objectNode;
    }

    /**
     * 处理头条按钮
     *
     * @param method
     * @param ids
     * @return
     */
    public ObjectNode headLineBtn(String method, long[] ids, int type, String account) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        for (int i = 0; i < ids.length; i++) {
            long id = ids[i];
            HeadLine headLine = find(HeadLine.class, id);
            long articleId = headLine.getaId();
            Article article = find(Article.class, articleId);

            if ("delete".equals(method)) {
                delete(HeadLine.class, headLine.getId());
                Map<String, Object> params = new HashMap<>();
                params.put("aId", articleId);
                if (type == 1) {
                    log.setContent("删除文字头条，文章ID：" + article.getId());
                    params.put("different", 1);
                    List<HeadLine> lines = list(HeadLine.class, " WHERE aId = :aId AND different = :different", params);
                    if (lines.size() == 0) {
                        article.sethAId(0);
                    }
                } else if (type == 2) {
                    log.setContent("删除图片头条，文章ID：" + article.getId());
                    params.put("different", 2);
                    List<HeadLine> lines = list(HeadLine.class, " WHERE aId = :aId AND different = :different", params);
                    if (lines.size() == 0) {
                        article.sethPId(0);
                    }
                }
                update(article);
            }
        }
        createBaseLog("头条管理", "删除", "删除头条ID：" + Arrays.toString(ids));
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 删除文章静态文件
     *
     * @param id
     * @return
     */
    public ObjectNode removeArticleFile(long id) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Article article = find(Article.class, id);
        if (null != article) {
            Category category = find(Category.class, article.getcId());
            String catePath = category.geteName() + File.separator + getThisYear();
            long idStr = config.getArticleIdAddend() + id;
            String prefixPath = config.getArticleDir() + File.separator + catePath + File.separator;
            String finalPath = prefixPath + idStr + ".html";
            File file = new File(finalPath);
            if (file.exists()) {
                file.delete();

                for (int i = 2; i < 50; i++) {
                    String otherId = idStr + "_" + i + ".html";
                    String otherPath = prefixPath + otherId;
                    File file1 = new File(otherPath);
                    if (file1.exists()) {
                        file1.delete();
                    } else {
                        otherId = idStr + "_all.html";
                        otherPath = prefixPath + otherId;
                        file1 = new File(otherPath);
                        if (file1.exists()) {
                            file1.delete();
                        }
                        break;
                    }
                }
            }
        }

        objectNode.put("success", true);
        return objectNode;
    }

    /////////////////////////////////////////////////

    /**
     * 创建subArticle
     *
     * @param id
     * @param contents
     */
    public void createSubArticleForContents(long id, String[] contents) {

        List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId=" + id);
        for (int i = 0; i < subArticles.size(); i++) {
            SubArticle subArticle = subArticles.get(i);
            delete(SubArticle.class, subArticle.getId());
        }

        for (int i = 1; i < contents.length; i++) {
            SubArticle subArticle = new SubArticle();
            subArticle.setaId(id);
            subArticle.setContent(contents[i]);
            subArticle.setSeq(i);
            subArticle.setCreateDate(new Date());
            create(subArticle);
        }

    }

    /**
     * 获取用户名
     *
     * @param id
     * @return
     */
    private String getCreator(long id) {
        User user = find(User.class, id);
        return null != user ? user.getName() : "";
    }

    /**
     * 获取栏目名称
     *
     * @param id
     * @return
     */
    private String getCategory(long id) {
        Category category = find(Category.class, id);
        return null != category ? category.getName() : "";
    }

    /**
     * 获取栏目id
     *
     * @param cName
     * @return
     */
    private long getCategoryId(String cName, boolean eName) {
        try {
            List<Category> categories;
            if (eName) {
                categories = list(Category.class, "WHERE name = '" + cName + "'");
            } else {
                categories = list(Category.class, "WHERE eName = '" + cName + "'");
            }

            Category category = categories.size() > 0 ? categories.get(0) : null;

            return null != category ? category.getId() : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 判断字符串是否为数字
     *
     * @param str
     * @return
     */
    private boolean isNumeric(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        Matcher isNum = pattern.matcher(str);
        return isNum.matches() ? true : false;
    }

    /**
     * 新增文章时根据category获取id
     *
     * @param category
     * @return
     */
    private int getCategoryIdForStr(String category) {
        int id = 0;
        Map<String, Object> params = new HashMap<>();
        params.put("eName", category);
        List<Category> categories = list(Category.class, " WHERE eName = :eName", params);
        if (categories.size() > 0) {
            id = (int) categories.get(0).getId();
        }
        return id;
    }

    /**
     * 返回相应操作的文章状态
     *
     * @param type
     * @param id
     * @return
     */
    private int getArticleStatusStr(String type, long id) {
        Article article = find(Article.class, id);
        switch (type) {
            case "audit":
                // 审核
                return Constant.ARTICLE_ID_ONE;
            case "rework":
                // 返工
                return Constant.ARTICLE_ID_FIVE;
            case "move":
                // 移动
                return 0;
            case "delete":
                // 删除
                int deleteNum = article.getStatus() < 10 ? article.getStatus() : 0;
                return Constant.ARTICLE_ID_TEN + deleteNum; // 需要加上原始状态
            case "release":
                // 发布
                return Constant.ARTICLE_ID_NINE;
            case "restore":
                // 还原
                int restoreNum = article.getStatus() >= 10 ? article.getStatus() : 0;
//                return restoreNum - Constant.ARTICLE_ID_TEN;
                return (restoreNum - Constant.ARTICLE_ID_TEN) > 0 ? Constant.ARTICLE_ID_FIVE : restoreNum - Constant.ARTICLE_ID_TEN;
            default:
                return 0;
        }
    }

    public String getTemplateTypeForId(int id) {
        Template template = find(Template.class, id);
        String result = "未知";
        int type = 0;
        if (null != template) {
            type = template.getType();
        }
        switch (type) {
            case 1:
                result = "文章模板";
                break;
            case 2:
                result = "栏目模板";
                break;
            case 3:
                result = "区块模板";
                break;
            case 4:
                result = "内嵌模板";
                break;
            default:
                break;
        }

        return result;
    }

    /**
     * 处理文章拼接
     *
     * @param id
     * @param contents
     */
    public void disposeSubArticle(long id, String[] contents) {
        Map<String, Object> params = new HashMap<>();
        params.put("aId", id);

        List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId = :aId", params);
        for (int j = 0; j < subArticles.size(); j++) {
            SubArticle subArticle = subArticles.get(j);
            delete(SubArticle.class, subArticle.getId());
        }
        createSubArticleForContents(id, contents);
    }

    public static String getThisYear() {
        return String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
    }

    /**
     * 根据文章ID撤销头条
     *
     * @param aId
     */
    private void repealHeadline(long aId) {
        List<HeadLine> headLines = list(HeadLine.class, String.format(" WHERE status = 9 AND aId = %s ", aId));
        for (int j = 0; j < headLines.size(); j++) {
            HeadLine headLine = headLines.get(j);
            headLine.setuId(0);
            headLine.setStatus(0);
            update(headLine);
        }
    }

    /**
     * 创建log日志
     */
    private void createBaseLog(String name, String action, String content) {
        User userInfo = (User) request.getAttribute("user");
        log = new Log();
        log.setIp(IpUtil.getIp(request));
        log.setAccount(userInfo.getAccount());
        log.setName(name);
        log.setAction(action);
        log.setContent(content);
        log.setCreateDate(new Date());
        create(log);
    }

    /**
     * 获取完整文章内容
     * @param article
     * @return
     */
    public String getArticleConetnt(Article article) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("aId", article.getId());

        List<SubArticle> subArticles = this.list(SubArticle.class, " WHERE aId = :aId ORDER BY seq ASC ", param);
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(article.getContent());

        for (int i = 0; i < subArticles.size(); i++) {
            stringBuilder.append(subArticles.get(i).getContent());
        }
        return stringBuilder.toString();
    }
}