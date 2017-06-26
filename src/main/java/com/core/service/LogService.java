package com.core.service;

import com.core.domain.Log;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

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
            name = searchModule.get(Integer.parseInt(name));
            params.put("name", name);
            sql += " AND name = :name";
        }
        // 动作
        String action = request.getParameter("action");
        if (!StringUtils.isBlank(action) && !"200".equals(action)) {
            action = searchAction.get(Integer.parseInt(action));
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

    public ObjectNode getSearchModuleActionList(boolean on_off) throws IOException {
        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode objectNode = objectMapper.createObjectNode();
        Iterator<Map.Entry<Integer, String>> iterator = null;
        if (on_off) {// on
            iterator = searchModule.entrySet().iterator();
        } else {// off
            iterator = searchAction.entrySet().iterator();
        }
        while(iterator.hasNext()) {
            ObjectNode jsonNode = objectMapper.createObjectNode();
            Map.Entry entry = iterator.next();
            jsonNode.put("id", (Integer) entry.getKey());
            jsonNode.put("name", (String) entry.getValue());
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    // 基础数据
    static Map<Integer, String> searchModule = new LinkedHashMap<Integer, String>() {{
        put(100, "全部");
        put(100, "发布管理");
        put(101, "广告管理");
        put(102, "文章管理");
        put(103, "头条管理");
        put(104, "内嵌管理");
        put(105, "标签管理");
        put(106, "模板管理");
        put(150, "媒体管理");
        put(151, "用户管理");
        put(152, "系统日志");
        put(153, "权限管理");
    }};

    static Map<Integer, String> searchAction = new LinkedHashMap<Integer, String>() {{
        put(200, "全部");
        put(201, "新增");
        put(202, "更新");
        put(203, "初稿");
        put(204, "审核");
        put(205, "发布");
        put(206, "返工");
        put(207, "还原");
        put(208, "废弃");
        put(209, "删除");
        put(210, "失败");
        put(211, "登录");
        put(212, "退出");
    }};
}