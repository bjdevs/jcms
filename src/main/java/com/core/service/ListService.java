package com.core.service;

import com.core.domain.Article;
import com.core.domain.Category;
import com.core.domain.HeadLine;
import com.core.domain.Media;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by muycode on 2017/5/25.
 */
@Service
public class ListService extends BaseService {

    public Object[] articleList(int cId, int page) {
        Object[] objects = new Object[3];

        if (cId == Constant.CATEGORY_ID_WATERZEN) {
            objects[0] = Constant.PHOTO_LIST_PAGE_NAME;
            objects[1] = photoList(12, page, cId);
        } else {
            objects[0] = Constant.ARTICLE_LIST_PAGE_NAME;
            objects[1] = articleTextList(10, page, cId);
        }

        Category category = find(Category.class, cId);
        objects[2] = category.geteName() + Constant.WINDOW_TITLE_SUFFIX;

        return objects;
    }


    /**
     * 文章列表
     *
     * @param pageSize
     * @param pageNum
     * @param categoryId
     * @return
     */
    public Map<String, Object> articleTextList(int pageSize, int pageNum, int categoryId) {

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("cId", categoryId);
        param.put("status", Constant.ARTICLE_ID_NINE);

        Page<Article> page = getPage(Article.class, " WHERE cId = :cId AND status = :status ORDER BY publishDate DESC", param, pageSize, pageNum);

        List<Article> articles = page.getResultList();
        List<Map> articleList = new ArrayList<Map>();

        for (int i = 0; i < articles.size(); i++) {
            Article article = articles.get(i);
            Map<String, Object> item = new HashMap<String, Object>();

            item.put("url", article.getUrl());
            item.put("title", article.getTitle());
            item.put("depict", article.getDepict());
            item.put("publishDate", new SimpleDateFormat("yyyy-MM-dd").format(article.getPublishDate()));
            articleList.add(item);
        }
        param.clear();

        Category category = find(Category.class, categoryId);
        param.put("categoryId", category.getId());
        param.put("category", category.geteName());
        param.put("data", articleList);
        param.put("totalPage", page.getTotalPage());
        param.put("pageNum", page.getPageNum());
        param.put("listEmpty", articles.size() == 0);

        return param;
    }

    /**
     * 图片列表
     *
     * @param pageSize
     * @param pageNum
     * @param categoryId
     * @return
     */
    public Map<String, Object> photoList(int pageSize, int pageNum, int categoryId) {

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("cId", categoryId);
        param.put("status", Constant.CATEGORY_ID_WATERZEN);

        Page<Article> page = getPage(Article.class, " WHERE cId = :cId AND status = :status AND hPId > 0 ORDER BY orderBy DESC, publishDate DESC", param, pageSize, pageNum);

        List<Article> articles = page.getResultList();
        List<Map> articleList = new ArrayList<Map>();

        for (int i = 0; i < articles.size(); i++) {
            Article article = articles.get(i);
            Map<String, Object> item = new HashMap<String, Object>();

            HeadLine headLine = find(HeadLine.class, article.gethPId());

            // 查找文章图片
            String image = "";
            if (headLine != null) {
                Media media = find(Media.class, headLine.getmId());
                image = media.getPic_279x186();
            }

            item.put("image", image);
            item.put("url", article.getUrl());
            item.put("title", article.getTitle());
            articleList.add(item);
        }

        param.clear();

        Category category = find(Category.class, categoryId);
        param.put("categoryId", category.getId());
        param.put("category", category.geteName());
        param.put("data", articleList);
        param.put("totalPage", page.getTotalPage());
        param.put("pageNum", page.getPageNum());
        param.put("listEmpty", articles.size() == 0);

        return param;
    }

}
