package com.core.service;

import com.core.domain.Log;
import com.core.domain.User;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import com.core.util.ProjectUtil;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sun
 */
@Service
public class LogService extends BaseService {

    /**
     *
     * @param request
     * @return
     */
    public ObjectNode getList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> params = new HashMap<String, Object>();
        String sql = "";
        sql = " WHERE 1 = 1";
        // 模块名称
        String name = request.getParameter("name");
        if (!StringUtils.isBlank(name) && !"100".equals(name)) {
            name = type.get(Integer.parseInt(name));
            params.put("name", name);
            sql += " AND name = :name";
        }
        // 动作
        String action = request.getParameter("action");
        if (!StringUtils.isBlank(action) && !"100".equals(action)) {
            action = type.get(Integer.parseInt(action));
            params.put("action", action);
            sql += " AND action = :action";
        }

        // 模糊查询
        String query = request.getParameter("query");
        if (!StringUtils.isBlank(query)) {
            params.put("account", "%" + query + "%");
            sql += " AND account LIKE :account";
        }

        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE+"");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1+"");

        sql += " ORDER BY createDate DESC";

        Page<Log> page = this.getPage(Log.class, sql, params, pageSize, pageNum);
        List<Log> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (Log m : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(m);
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    static Map<Integer, String> type = new HashMap<Integer, String>() {{
        put(100, "全部");
        put(101, "媒体管理");
        put(102, "广告管理");
        put(200, "新增");
        put(201, "修改");
        put(202, "删除");
        put(203, "启用");
        put(204, "废弃");
        put(205, "初稿");
        put(206, "已签");
        put(207, "返工");
        put(208, "已发");
        put(209, "已删");
    }};


    private String getContent(String str) {
        // 模块ID从100开始，动作ID从200开始

        return "";
    }
}