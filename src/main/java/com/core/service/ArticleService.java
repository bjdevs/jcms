package com.core.service;

import com.core.controller.ArticleStaticController;
import com.core.domain.*;
import com.core.util.Constant;
import org.apache.commons.lang.StringUtils;
import org.apache.velocity.tools.generic.ClassTool;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
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
    private ArticleStaticController articleStaticController;

    /**
     * 获取显示的数据
     *
     * @return
     */
    public ObjectNode list(String cName, int page, int start, int limit, String idStr, String title, String startDate, String endDate) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("status", Constant.ARTICLE_ID_TEN);
        StringBuffer sql = new StringBuffer();
        sql.append("WHERE ");
        long cId;
        if ("recycle".equals(cName)) {
            sql.append("status >= :status");
        } else if ("all".equals(cName)) {
            sql.append("status < :status");
        }  else {
            cId = getCategoryId(cName);
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
            param.put("title", title);
            sql.append(" AND title = :title");
        }
        if (!StringUtils.isBlank(startDate) && !StringUtils.isBlank(endDate)) {
            startDate = startDate.substring(0, startDate.indexOf("T"));
            endDate = endDate.substring(0, endDate.indexOf("T"));
            param.put("start", startDate);
            param.put("end", endDate);
            sql.append(" AND createDate BETWEEN :start AND :end");
        }

        sql.append(" ORDER BY updateDate DESC,createDate DESC");

        ObjectNode objectNode = objectMapper.createObjectNode();
        List<Article> articles = list(Article.class, sql.toString(), param);
        ArrayNode arrayNode = objectMapper.createArrayNode();
        try {
            for (int i = 0; i < articles.size(); i++) {
                Article article = articles.get(i);
                ObjectNode jsonNodes = objectMapper.valueToTree(article);
                jsonNodes.put("creator", getCreator(article.getuId()));
                jsonNodes.put("category", getCategory(article.getcId()));
                arrayNode.add(jsonNodes);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("rows", arrayNode);

        return objectNode;
    }

    /**
     * 查询头条
     *
     * @param cName
     * @param type
     * @return
     */
    public ObjectNode headLineList(String cName, String type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> param = new HashMap<String, Object>();
        long id = getCategoryId(cName);
        if (id == 0) {
            return null;
        }

        StringBuffer sql = new StringBuffer();
        int different = "text".equals(type) ? 1 : 2;
        sql.append("WHERE cId = :cId AND different = :different ")
                .append("ORDER BY updateDate DESC, createDate DESC");
        param.put("cId", id);
        param.put("different", different);

        List<HeadLine> headLines = list(HeadLine.class, sql.toString(), param);
        ObjectNode objectNode1;
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (int i = 0; i < headLines.size(); i++) {
            HeadLine headLine = headLines.get(i);
            objectNode1 = objectMapper.valueToTree(headLine);
            objectNode1.put("creator", getCreator(headLine.getuId()));
            objectNode1.put("category", getCategory(headLine.getcId()));
            arrayNode.add(objectNode1);
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

        System.out.println("开始执行");

        ObjectNode objectNode = objectMapper.createObjectNode();
        /**
         *
         * 需要增加一个模板ID
         *
         */

        String title = request.getParameter("title");
        String source = request.getParameter("source");
        String author = request.getParameter("author");
        if (author.length() == 0) {
            author = request.getParameter("authorStr");
        }
        String depict = request.getParameter("depict");
        String[] kIds = request.getParameterValues("kId");
        String[] sIds = request.getParameterValues("sId");
        String category = request.getParameter("category");
        String content = request.getParameter("content");
        String userId = request.getParameter("userId");

        int categoryId = getCategoryIdForStr(category);
        String[] contentArray = builderContentArray(content);
        if (contentArray.length < 1) {
            objectNode.put("result", "contentLength error");
            objectNode.put("success", false);
            return objectNode;
        }
        System.out.println("title: " + title);
        source = (null == source || "".equals(source)) ? "黄梅老祖寺" : source;
        System.out.println("source: " + source);
        System.out.println("author: " + author);
        System.out.println("depict: " + depict);
        System.out.println("category: " + category + " == " + categoryId);
        System.out.println("content: " + content);

        for (String idStr : kIds) {
            if (isNumeric(idStr)) {
                System.out.println(idStr + ": 修改");
                generalArticleService.updateKeyWordToCount(Long.parseLong(idStr));
            } else {
                System.out.println(idStr + ": 新增");
                generalArticleService.createKeyWord(idStr);
            }
        }
        for (String s : sIds) {
            System.out.println("待处理 --- sId: " + s);
        }

        Article article = new Article();
        // userId 需要根据最终需求填写相应id
        article.setuId(1);
        article.setAuthor(author);
        article.setSource(source);
        article.setTitle(title);
        article.setDepict(depict);
        article.setUrl("需要创建静态文件，并返回URL");
        article.setContent(contentArray[0]);
        // 需要存储一个keyWord与article多对多关系id
        article.setkId(0);
        // 连载Id，默认为 0
        article.setsId(0);
        // 需要一个模版Id
        article.settId(0);
        article.sethAId(0);
        article.sethPId(0);
        article.setcId(categoryId);
        article.setStatus(Constant.ARTICLE_ID_ZERO);
        article.setCreateDate(new Date());

        long articleId = create(article);
        if (articleId > 0) {
            createSubArticleForContents(articleId, contentArray);

            objectNode.put("result", "success");
            objectNode.put("success", true);

            return objectNode;
        } else {
            objectNode.put("result", "Create Article Error");
            objectNode.put("success", false);
            return objectNode;
        }
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
        boolean success = true;
        try {
            for (int i = 0; i < ids.length; i++) {
                long id = Long.parseLong(ids[i]);
                num = getArticleStatusStr(type, id);
                Article article = find(Article.class, id);

                if (null != article) {
                    article.setStatus(num);
                    article.setUpdateDate(new Date());
                    update(article);
                }
            }
        } catch (Exception e) {
            success = false;
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

        for (int i = 0; i < ids.length; i++) {
            long id = Long.parseLong(ids[i]);
            Article article = find(Article.class, id);
            if (null != article) {
                article.setcId(categoryId);
                update(article);
            }

        }
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 查询 标签
     *
     * @return
     */
    public ObjectNode keyWordList(String type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> params = new HashMap<>();
        int minLimit = 0;
        int maxLimit = 10;
        StringBuffer sb = new StringBuffer();
        sb.append(" ORDER BY");
        params.put("minLimit", minLimit);
        params.put("maxLimit", maxLimit);
        if ("list".equals(type)) {
            // 列表
            sb.append(" updateDate DESC, createDate DESC");
            params = null;
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

        return objectNode;
    }

    /**
     * 修改 标签
     *
     * @param data
     * @return
     */
    public ObjectNode updateKeyWord(String method, String data, String[] ids) {
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

        return objectNode;
    }

    /**
     * 查询 category
     *
     * @return
     */
    public ObjectNode categoryList() {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        List<Category> categories = list(Category.class, " WHERE status > 0");
        ObjectNode objectNode1;
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            objectNode1 = objectMapper.valueToTree(category);
            objectNode1.put("path", "/" + category.geteName() + "/");
            objectNode1.put("category_template", getTemplateTypeForId(category.gettId()));
            objectNode1.put("article_template", getTemplateNameForId(category.gettAId()));
            arrayNode.add(objectNode1);
        }
        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 查询 Template
     * @return
     */
    public ObjectNode templateList(){
        ObjectNode objectNode = objectMapper.createObjectNode();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        List<Template> templates = list(Template.class, "ORDER BY updateDate DESC, createDate DESC");
        for (int i = 0; i < templates.size(); i++){
            Template template = templates.get(i);
            arrayNode.add(objectMapper.valueToTree(template));

        }
        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 返回单个文章
     * @return
     */
    public ObjectNode getArticleForId(long id){
        ObjectNode objectNode = objectMapper.createObjectNode();

        Article article = find(Article.class, id);
        StringBuffer contentSb = new StringBuffer();

        if (null != article){
            contentSb.append(article.getContent());

            Map<String, Object> params = new HashMap<>();
            params.put("aId", article.getId());
            List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId = :aId ORDER BY seq ASC", params);
            for (int i = 0; i < subArticles.size(); i++){
                SubArticle subArticle = subArticles.get(i);
                contentSb.append(subArticle.getContent());
            }

            if (id == 3){ // 广种福田
                String[] fuTians = contentSb.toString().split(Constant.ARTICE_CONTENT_SPLICE);
                objectNode.put("depict", fuTians.length >=0 ? fuTians[0] : "");
                objectNode.put("use", fuTians.length >=1 ? fuTians[1] : "");
                objectNode.put("bank", fuTians.length >=2 ? fuTians[2] : "");
                objectNode.put("user", fuTians.length >=3 ? fuTians[3] : "");
                objectNode.put("card", fuTians.length >=4 ? fuTians[4] : "");
                return objectNode;
            }
            if (id == 4){ // 联系我们
                String[] contacts = contentSb.toString().split(Constant.ARTICE_CONTENT_SPLICE);
                ArrayNode arrayNode = objectMapper.createArrayNode();
                ObjectNode objectNode1;
                for (int i = 1; i < contacts.length; i++){
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
     * 用于修改导航、...
     * @param id
     * @param content
     * @return
     */
    public ObjectNode updateArticleForId(long id, String content){
        ObjectNode objectNode = objectMapper.createObjectNode();
        content = content.replaceAll("</li>\n\r*", "</li>,");
//        content = content.substring(0, content.lastIndexOf(","));

        String[] contents = builderContentArray(content);
        if (contents.length > 0){
            Article article = find(Article.class, id);
            article.setContent(contents[0]);
            update(article);

            Map<String, Object> params = new HashMap<>();
            params.put("aId", id);

            List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId = :aId", params);
            for (int j = 0; j < subArticles.size(); j++){
                SubArticle subArticle = subArticles.get(j);
                delete(SubArticle.class, subArticle.getId());
            }
            createSubArticleForContents(id, contents);

        }
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 修改广种福田
     * @param request
     * @return
     */
    public ObjectNode updataFutian(HttpServletRequest request){
        ObjectNode objectNode = objectMapper.createObjectNode();
        String depict = request.getParameter("depict");
        String use = request.getParameter("use");
        String bank = request.getParameter("bank");
        String user = request.getParameter("user");
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

        update(article);

        createSubArticleForContents(3, content);

        objectNode.put("success", true);

        return objectNode;
    }

    /**
     * 修改 联系我们
     * @param request
     * @return
     */
    public ObjectNode updateContact(HttpServletRequest request){
        ObjectNode objectNode = objectMapper.createObjectNode();

        String contactId = request.getParameter("contactId");
        String contactKey = request.getParameter("contactKey");
        String contactValue = request.getParameter("contactValue");

        Article article = find(Article.class, 4);
        String[] contents = article.getContent().split(Constant.ARTICE_CONTENT_SPLICE);

        String updateContent = contactKey + "," + contactValue;

        int id = Integer.parseInt(contactId);

        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < contents.length; i++){
            if (i == id){
                contents[i] = updateContent;
            }
            if (i == contents.length - 1){
                sb.append(contents[i]);
            } else {
                sb.append(contents[i]).append(Constant.ARTICE_CONTENT_SPLICE);
            }
        }
        article.setContent(sb.toString());
        article.setUpdateDate(new Date());
        update(article);
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 首页显示总数
     * @return
     */
    public ObjectNode getFileInfo(){
        ObjectNode objectNode = objectMapper.createObjectNode();

        int count = count(Article.class, " WHERE id > 4");

        objectNode.put("article", count);
        objectNode.put("picture", "待完善");
        objectNode.put("voice", "待完善");

        return objectNode;
    }

    /**
     * 发布记录
     * @return
     */
    public ObjectNode publishList(){
        ObjectNode objectNode = objectMapper.createObjectNode();

        List<PublishLog> publishLogs = list(PublishLog.class, " ORDER BY requestDate DESC, finishDate DESC");
        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode objectNode1;
        for (int i = 0; i < publishLogs.size(); i++){
            PublishLog publishLog = publishLogs.get(i);
            objectNode1 = objectMapper.valueToTree(publishLog);
            objectNode1.put("user", getCreator(publishLog.getUserId()));
            arrayNode.add(objectNode1);
        }

        objectNode.put("rows", arrayNode);
        return objectNode;
    }

    /**
     * 全局发布页面
     * @return
     */
    public ObjectNode publishAll(){
        ObjectNode objectNode = objectMapper.createObjectNode();
        articleStaticController.createIndex();

        return objectNode;
    }

    /////////////////////////////////////////////////

    /**
     * 创建subArticle
     * @param id
     * @param contents
     */
    public void createSubArticleForContents(long id, String[] contents){

        List<SubArticle> subArticles = list(SubArticle.class, "WHERE aId="+id);
        for (int i = 0; i < subArticles.size(); i++){
            SubArticle subArticle = subArticles.get(i);
            delete(SubArticle.class, subArticle.getId());
        }

        for (int i = 1; i < contents.length; i++){
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
        return null != category ? category.geteName() : "";
    }

    /**
     * 获取栏目id
     *
     * @param cName
     * @return
     */
    private long getCategoryId(String cName) {
        try {
            List<Category> categories = list(Category.class, "WHERE name = '" + cName + "'");
            Category category = categories.size() > 0 ? categories.get(0) : null;

            return null != category ? category.getId() : 0;
        } catch (Exception e) {
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
     * 建立文本数组
     *
     * @param content
     * @return
     */
    private String[] builderContentArray(String content) {

        /*
        * 未实现 文章分页功能
        * */

        int size = content.length() / Constant.ARTICLE_CONTENT_LENGTH;
        size = content.length() % Constant.ARTICLE_CONTENT_LENGTH == 0 ? size : size + 1;

        String[] contentArray = new String[size];

        for (int i = 0; i < size; i++) {
            int index = (i + 1) * Constant.ARTICLE_CONTENT_LENGTH;
            index = index < content.length() ? index : content.length();
            contentArray[i] = content.substring(i * Constant.ARTICLE_CONTENT_LENGTH, index);
        }
        return contentArray;
    }

    /**
     * 新增文章时根据category获取id
     *
     * @param category
     * @return
     */
    private int getCategoryIdForStr(String category) {
        switch (category) {
            case "news":
                return Constant.CATEGORY_ID_NEWS;
            case "life":
                return Constant.CATEGORY_ID_LIFE;
            case "ziyunfoguo":
                return Constant.CATEGORY_ID_ZIYUNFOGUO;
            case "medical":
                return Constant.CATEGORY_ID_MEDICAL;
            case "knowledge":
                return Constant.CATEGORY_ID_KNOWLEDGE;
            case "depository":
                return Constant.CATEGORY_ID_DEPOSITORY;
            case "law":
                return Constant.CATEGORY_ID_LAW;
            case "waterzen":
                return Constant.CATEGORY_ID_WATERZEN;
            case "notice":
                return Constant.CATEGORY_ID_NOTICE;
            default:
                return 0;
        }
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
                return restoreNum - Constant.ARTICLE_ID_TEN;
            default:
                return 0;
        }
    }

    /**
     * 根据Template获取name
     * @param id
     * @return
     */
    public String getTemplateNameForId(int id){
        if (id == 0){
            return "未知";
        }

        return find(Template.class, id).getName();
    }

    public String getTemplateTypeForId(int id){
        Template template = find(Template.class, id);
        String result = "未知";
        int type = 0;
        if (null != template){
            type = template.getType();
        }
        switch (type){
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
}
