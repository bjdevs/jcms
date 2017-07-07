package com.core.service;

import com.core.config.Config;
import com.core.config.LuceneConfig;
import com.core.domain.Article;
import com.core.domain.PublishLog;
import com.core.domain.SearchResult;
import com.core.domain.User;
import com.core.util.Constant;
import com.core.util.LuceneUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.lucene.document.*;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.Term;
import org.apache.lucene.sandbox.queries.DuplicateFilter;
import org.apache.lucene.search.*;
import org.apache.lucene.search.highlight.Highlighter;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.apache.lucene.util.automaton.TooComplexToDeterminizeException;
import org.codehaus.jackson.node.ObjectNode;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.ParseException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by sun on 2017/7/5.
 */

@Service
public class ArticleIndexService extends BaseService{

    @Autowired
    protected Config config;

    @Autowired
    LuceneConfig luceneConfig;

    @Autowired
    ArticleService articleService;

    @Autowired
    HomePageService homePageService;

    protected static String PATH = System.getProperty("webapp.root") + "article";

    /**
     * 创建文章索引
     *
     * @param articles
     */
    /*public void addArticle(ArrayList<Article> articles) {
        IndexWriter writer = null;
        try {
            writer = LuceneUtil.getIndexWriter();
            for (Article article : articles) {
                writer.addDocument(article2Document(article));
            }
            writer.commit();
            LuceneUtil.updateIndex();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }*/

    /**
     * 更新文章索引
     *
     * @param articles
     */
    public void updateArticle(ArrayList<Article> articles) {
        IndexWriter writer = null;
        try {
            writer = LuceneUtil.getIndexWriter();
            for (Article article : articles) {
                writer.updateDocument(new Term("id", article.getLuceneId() + ""), article2Document(article));
            }
            writer.commit();
            LuceneUtil.updateIndex();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 删除文章索引
     *
     * @param article
     */
    public void deleteArticle(Article article) {

        String realPath = config.getStaticResourceURLPrefix();
        IndexWriter writer = null;
        List<File> fileList = null;
        try {
            // 开始分析URL结构
            String url = article.getUrl();
            String[] urls = url.split(realPath);
            // 获取到从分类目录开始的路径
            url = urls[1].substring(1,urls[1].length());
            // 解析文章地址
            String[] fileInfo = getFileInfo(url);
            // 获取当前文章下的所有分页地址
            fileList = getExistingPathList(PATH,fileInfo);
            // 准备要删除的文章地址
            for (File file : fileList) {
                urls = file.getAbsolutePath().split("article");
                url = urls[1].substring(1,urls[1].length());
                fileInfo = getFileInfo(url);
                writer = LuceneUtil.getIndexWriter();
                writer.deleteDocuments(new Term("id", fileInfo[2]));
                writer.commit();
            }
            LuceneUtil.updateIndex();
            log("索引管理", "删除", "文章ID:"+article.getId() + ",标题:" + article.getTitle());
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            fileList.clear();
        }
    }

    /**
     * Article2Document
     * @param article
     * @return
     */
    public Document article2Document(Article article) {
        Document doc = new Document();
        Date publishDate=new Date();
        if(article.getPublishDate() != null){
            publishDate = article.getPublishDate();
        }
        doc.add(new NumericDocValuesField("publishDate", publishDate.getTime()));

        doc.add(new StringField("id", article.getLuceneId()+"", Field.Store.YES));//
        doc.add(new StringField("source", StringUtils.isBlank(article.getSource())?"":article.getSource(), Field.Store.YES));
        doc.add(new StringField("author",StringUtils.isBlank(article.getAuthor())?"":article.getAuthor(), Field.Store.YES));

        doc.add(new TextField("title", StringUtils.isBlank(article.getTitle())?"":article.getTitle(), Field.Store.YES));
        doc.add(new TextField("depict",StringUtils.isBlank(article.getDepict())?"":article.getDepict(), Field.Store.YES));
        doc.add(new TextField("content",StringUtils.isBlank(article.getContent())?"": LuceneUtil.html2Text(article.getContent()), Field.Store.YES));
        doc.add(new StoredField("url", StringUtils.isBlank(article.getUrl())?"":article.getUrl()));
        doc.add(new StringField("cId", article.getcId()+"", Field.Store.NO));
        doc.add(new LongField("publishDate",publishDate.getTime(), Field.Store.YES));
        return doc;
    }

    /**
     * Document2Article
     * @param document
     * @return
     */
    public static Article document2Article(Document document,Highlighter highlighter) throws ParseException, IOException, InvalidTokenOffsetsException {

        String title = document.get("title");
        String htitle = highlighter.getBestFragment(LuceneConfig.getAnalyzer(),"title",title);
        if(htitle==null) {
            int minLen = Math.min(Constant.LUCENE_TITLE_FRAGMENT_LEN, title.length());
            title = title.substring(0,minLen);
        }else {
            title = htitle;
        }

        String content = document.get("content");
        String hcontent = highlighter.getBestFragment(LuceneConfig.getAnalyzer(),"content",content);
        if(hcontent==null) {
            int minLen = Math.min(Constant.LUCENE_CONTENT_FRAGMENT_LEN, content.length());
            content = content.substring(0,minLen);
        }else{
            content = hcontent;
        }

        String createTimeStr = document.get("createDate");
        String publishTimeStr = document.get("publishDate");
        long createTime,publishTime;
        Date createDate=null,publishDate=null;

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);

        article.setUrl(document.get("url"));
        if (StringUtils.isNotBlank(createTimeStr)){
            createTime = NumberUtils.toLong(createTimeStr, 0);
            if(createTime!=0) {
                createDate = new Date(createTime);
            }
        }
        if(StringUtils.isNotBlank(publishTimeStr)){
            publishTime = NumberUtils.toLong(publishTimeStr,0);
            if(publishTime!=0) {
                publishDate = new Date(publishTime);
            }
        }
        article.setCreateDate(createDate);
        article.setPublishDate(publishDate);

        return article;
    }

    public SearchResult<Article> searchArticle(Query query, int startNum, int maxNum, Sort sort) {
        List<Article> list = new ArrayList<Article>();
        IndexSearcher indexSearcher = null;
        indexSearcher = LuceneUtil.getIndexSearcher();

        TopDocs topDocs = null;
        try {
            if (sort != null) {
                topDocs = indexSearcher.search(query, startNum + maxNum, sort);
            } else {
                topDocs = indexSearcher.search(query, startNum + maxNum);
            }
            int count = topDocs.totalHits;

            ScoreDoc[] docs = topDocs.scoreDocs;
            int minNum = Math.min(docs.length, startNum + maxNum);

            Highlighter highlighter = LuceneUtil.createHighlighter(query);

            for (int i = startNum; i < minNum; i++) {
                Document document = indexSearcher.doc(docs[i].doc);
                list.add(document2Article(document, highlighter));
            }
            return new SearchResult<Article>(count, list);
        } catch (TooComplexToDeterminizeException e) {
            return new SearchResult<Article>(0, list);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 批量 新建/更新 索引
     * @param articleList
     * @return true 成功, false 失败;
     */
    public boolean updateIndex(List<Article> articleList) {
        boolean status = false;
        String realPath = config.getStaticResourceURLPrefix();
        ArrayList<Article> updateArticleList = new ArrayList<Article>();
        Article articleNew = null;
        for (Article article : articleList) {
            String url = article.getUrl();
            String[] urls = url.split(realPath);
            // 获取到从分类目录开始的路径
            url = urls[1].substring(1,urls[1].length());
            StringBuilder stringBuilder = new StringBuilder();
            BufferedReader reader = null;
            String tempHTML = "";
            // 解析文章地址
            String[] fileInfo = getFileInfo(url);
            // 获取当前文章下的所有分页地址
            List<File> fileList = getExistingPathList(PATH,fileInfo);
            try {
                for (File file : fileList) {
                    urls = file.getAbsolutePath().split("article");
                    url = urls[1].substring(1,urls[1].length());
                    fileInfo = getFileInfo(url);
                    InputStreamReader isr = new InputStreamReader(new FileInputStream(file), Constant.ENCODE_UTF8);
                    reader = new BufferedReader(isr);
                    while ((tempHTML = reader.readLine()) != null){
                        stringBuilder.append(tempHTML);
                    }
                    articleNew = new Article();
                    org.jsoup.nodes.Document doc = Jsoup.parse(stringBuilder.toString());
                    String title = getStr(doc.select("h2"));
                    String content = getStr(doc.select(".detail"));
                    String urlPublish = realPath + System.getProperty("file.separator") +
                            fileInfo[0] + System.getProperty("file.separator") +
                            fileInfo[1] + System.getProperty("file.separator") +
                            fileInfo[2] + ".html";
                    articleNew.setLuceneId(fileInfo[2]+"");
                    articleNew.setcId(article.getcId());
                    articleNew.setPublishDate(article.getPublishDate());
                    articleNew.setAuthor(article.getAuthor());
                    articleNew.setDepict(article.getDepict());
                    articleNew.setSource(article.getSource());
                    articleNew.setTitle(title);
                    articleNew.setContent(content);
                    articleNew.setUrl(urlPublish);
                    stringBuilder.setLength(0);
                    reader.close();
                    isr.close();
                    updateArticleList.add(articleNew);
                    status = true;
                }
                // 批量更新索引
                if (updateArticleList.size() > 0) {
                    this.updateArticle(updateArticleList);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                stringBuilder.setLength(0);
                fileList.clear();
                fileInfo = null;
                urls = null;
                articleNew = null;
            }
        }
        return status;

    }

    // 支持数组类型重建索引
    public boolean updateIndex(String[] ids) {
        List<Article> articleList = new ArrayList<Article>();
        for (String id : ids) {
            long idLong = Long.parseLong(id);
            Article article = find(Article.class, idLong);
            articleList.add(article);
        }
        return updateIndex(articleList);
    }

    /**
     * 重建所有已发文章索引
     * @return
     */
    public ObjectNode reBuildALLPublishIndex() {
        User user = (User) request.getAttribute("user");
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("success", true);
        String result = "failed";
        String message = "重建索引遇到问题，请联系系统管理员解决 :(";
        try {
            // 查询所有已发文章重建索引
            Map<String, Object> params = new HashMap<String, Object>();
            String sql = " WHERE id > 7 AND status = :status ORDER BY id desc";
            params.put("status", Constant.ARTICLE_ID_NINE);
            List<Article> articleList = baseRepository.list(Article.class, sql, params);
            StringBuilder stringBuilder = new StringBuilder();
            for (Article article : articleList) {
                stringBuilder.append(article.getId()).append("_").append(article.getTitle()).append(",");
            }
            boolean status = updateIndex(articleList);
            if (status) {
                long publishId = homePageService.createPublishLog(user.getId(), "重建文章已发索引完成，共：" + articleList.size() + "篇已被索引");
                PublishLog publishLog = find(PublishLog.class, publishId);
                publishLog.setFinishDate(new Date());
                update(publishLog);
                result = "true";
            }
            log("索引管理", "更新", "重建文章已发索引完成，共：" + articleList.size() + "篇已被索引," + stringBuilder.toString().substring(0,stringBuilder.length()-1));
            stringBuilder.setLength(0);
            articleList.clear();
            params.clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("result", result);
        objectNode.put("message", message);
        return objectNode;
    }

    private List<File> getExistingPathList (String path,String[] fileInfo) {
        List<File> list = new ArrayList<File>();
        if (fileInfo.length == 3) {
            File file = new File(path + System.getProperty("file.separator") +
                    fileInfo[0] + System.getProperty("file.separator") +
                    fileInfo[1] + System.getProperty("file.separator"));
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (File f : files) {
                    if (f.getAbsolutePath().indexOf(fileInfo[0] + System.getProperty("file.separator") +
                            fileInfo[1] + System.getProperty("file.separator") + fileInfo[2]) > 0) {
                        list.add(f);
                    }
                }
            }
        }
        return list;
    }

    private String[] getFileInfo(String url) {
        String[] strs = new String[3];
        BufferedReader reader = null;
        Pattern pattern = Pattern.compile("^[a-z]+"); // 获取URL的分类
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            String category = matcher.group();
            strs[0] = category;
            //pattern = Pattern.compile("\\d+\\/\\d+(_[a-z]+|_\\d+)*");//获取URL的时间和文件名
            pattern = Pattern.compile("\\d+(\\/|\\\\)\\d+(_[a-z]+|_\\d+)*");//获取URL的时间和文件名
            matcher = pattern.matcher(url);
            if (matcher.find()) {
                String[] info = matcher.group().split("/");
                if (info.length != 2) {
                    info = matcher.group().split("\\\\");
                }
                strs[1] = info[0];
                strs[2] = info[1];
            }
        }
        return strs;
    }

    /**
     * 获取HTML元素 并 过滤所有全角、空格、制表符、换行、回车
     * @param dom
     * @return
     */
    private String getStr(Elements dom) {
        Pattern pattern = Pattern.compile("\\s*|\t*|\r|\n");
        Matcher matcher = pattern.matcher(LuceneUtil.html2Text(dom.get(0).getAllElements().get(0).toString().replace((char)12288, ' ')));
        return matcher.replaceAll("");
    }

    private String getDate(String str) {
        Pattern pattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
        Matcher matcher = pattern.matcher(str);
        if (matcher.find()) {
            str = matcher.group();
        } else {
            str = "";
        }
        return str;
    }
}
