package com.core.controller;

import com.core.config.LuceneConfig;
import com.core.domain.Article;
import com.core.domain.Category;
import com.core.domain.SearchResult;
import com.core.repository.sqlBuilder.SearchResultPage;
import com.core.security.annotation.AsRight;
import com.core.service.ArticleIndexService;
import com.core.service.ListService;
import com.core.util.Constant;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.sandbox.queries.DuplicateFilter;
import org.apache.lucene.search.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.apache.lucene.sandbox.queries.DuplicateFilter.KeepMode.KM_USE_FIRST_OCCURRENCE;
import static org.apache.lucene.sandbox.queries.DuplicateFilter.ProcessingMode.PM_FULL_VALIDATION;

/**
 * Created by sun on 2017/7/5.
 */

@Controller
public class ArticlIndexController extends BaseController {
    @Autowired
    LuceneConfig luceneConfig;
    @Autowired
    ArticleIndexService articleIndexService;
    @Autowired
    HttpServletRequest request;
    @Autowired
    ListService listService;

    @RequestMapping(value = "/q")
    public String search(Model model) {
        SearchResultPage<Article> resultPage = null;
        int pageSize = Constant.LUCENE_SEARCH_PAGESIZE;
        String category = request.getParameter("c");
        String sortStr = request.getParameter("sort");
        int timerange = NumberUtils.toInt(request.getParameter("t"), 0);
        int currentPage = NumberUtils.toInt(request.getParameter("pn"), 1);
        String keyword = request.getParameter("kw");

        if (StringUtils.isEmpty(keyword)) {
            resultPage = new SearchResultPage<Article>(new SearchResult<Article>(0, new ArrayList<Article>()), 1, pageSize);
        } else {
            SearchResult<Article> searchResult = null;
            Query query1 = null;
            BooleanQuery booleanQuery = new BooleanQuery();
            MultiFieldQueryParser multiFieldQueryParser = new MultiFieldQueryParser(LuceneConfig.getDefaultSearchField(), LuceneConfig.getAnalyzer());

            // 过滤索引相同Field，相同项只取第一个结果。
            DuplicateFilter filter = new DuplicateFilter("title", KM_USE_FIRST_OCCURRENCE, PM_FULL_VALIDATION);
            booleanQuery.add(filter, BooleanClause.Occur.MUST);

            try {
                query1 = multiFieldQueryParser.parse(keyword);

                booleanQuery.add(query1, BooleanClause.Occur.MUST);
                if (!StringUtils.isEmpty(category)) {
                    PhraseQuery query2 = new PhraseQuery();
                    query2.add(new Term("cId", category));
                    booleanQuery.add(query2, BooleanClause.Occur.MUST);
                }
                if (timerange > 0) {
                    Calendar cal = Calendar.getInstance();
                    cal.set(Calendar.HOUR, 0);
                    cal.set(Calendar.SECOND, 0);
                    cal.set(Calendar.MINUTE, 0);
                    cal.set(Calendar.MILLISECOND, 0);
                    long start = cal.getTimeInMillis() - (timerange - 1) * 24 * 60 * 60 * 1000L;

                    NumericRangeQuery rangeQuery = NumericRangeQuery.newLongRange("publishDate", start, new Date().getTime(), true, true);
                    booleanQuery.add(rangeQuery, BooleanClause.Occur.MUST);
                }
                Sort sort = null;
                if ("date".equals(sortStr)) {
                    sort = new Sort(new SortField("publishDate", SortField.Type.LONG, true));
                }
                searchResult = articleIndexService.searchArticle(booleanQuery, (currentPage > 0 ? currentPage - 1 : 0) * pageSize, pageSize, sort);
            } catch (ParseException e) {
                searchResult = new SearchResult<Article>(0, new ArrayList<Article>());
            }
            resultPage = new SearchResultPage<Article>(searchResult, currentPage, pageSize);
        }
        List<Category> list = listService.listByStatus(Constant.ARTICLE_ID_ONE);
        model.addAttribute("categorys", list);

        model.addAttribute("keyword", keyword);
        model.addAttribute("c", category);
        model.addAttribute("sort", sortStr);
        model.addAttribute("t", timerange);
        model.addAttribute("resultPage", resultPage);
        return "q";
    }
}