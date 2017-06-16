package com.core.service;

import com.core.domain.HeadLine;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by a on 2017/4/28.
 */
@Service
public class HeadLineService extends BaseService {


    /**
     * 根据分类查询头条列表
     * @param categoryId
     * @param maxLimit
     * @return
     */
    public List<HeadLine> searchHeadLine(int categoryId, int different , int maxLimit) {
        Map<String, Object> paramArticle = new HashMap<String, Object>();
        paramArticle.put("cId", categoryId);
        paramArticle.put("different", different);
        StringBuffer sql = new StringBuffer();
        sql.append("WHERE STATUS=9 AND cId=:cId AND different=:different ORDER BY updateDate DESC, cateOrderBy ASC ");
        String limit = "LIMIT 0,";
        if(maxLimit != 0){
            limit += maxLimit;
            sql.append(limit);
        }

        List<HeadLine> headLines = new ArrayList<HeadLine>();

        List<HeadLine> newsList = list(HeadLine.class, sql.toString(), paramArticle);
        // 水墨禅韵，首页焦点图

        for (int i = 0; i < newsList.size(); i++) {
            HeadLine headLine = newsList.get(i);
            headLines.add(i, headLine);
        }
        return headLines;
    }


}
