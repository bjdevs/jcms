package com.core.service;

import com.core.domain.*;
import com.core.repository.SecurityRepository;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.core.util.Constant.AUTH_ACCOUNT;
import static com.core.util.Constant.AUTH_USER;

/**
 * Created by sun
 */
@Service
public class AuthService extends BaseService {

    @Autowired
    SecurityRepository securityRepository;

    @Autowired
    protected NamedParameterJdbcTemplate jdbcTemplate;

    // 功能管理
    /**
     *
     * @param request
     * @return
     */
    public ObjectNode getFunctionList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> params = new HashMap<String, Object>();
        String sql = "";
        sql = " WHERE 1 = 1";

        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE+"");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1+"");

        Page<Function> page = this.getPage(Function.class, sql, params, pageSize, pageNum);
        List<Function> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (Function m : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(m);
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    public String updateAuthFunction(HttpServletRequest request) throws Exception {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String result = "failed";
        boolean isVerify = true;
        String message = "";
        String data = request.getParameter("data");
        if (StringUtils.isBlank(data)) {
            // 新增
            long id = Integer.parseInt(request.getParameter("id"));
            String name = request.getParameter("name");
            if (StringUtils.isBlank(name)) {
                message = "标题不能为空";
                isVerify = false;
            }
            // 后台验证通过
            if (isVerify) {
                // 新增
                Function function = new Function();
                function.setId(id);
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("id", id);
                String sql = " WHERE id = :id";
                int count = baseRepository.count(Function.class, sql, params);
                if (count > 0) {
                    message = "ID：" + function.getId() + " 重复，请重新填写";
                    log("权限管理", "失败", "功能，ID：" + function.getId() + "重复");
                } else {
                    function.setName(name);
                    baseRepository.create(function);
                    // 执行保存的逻辑
                    result = "success";
                    log("权限管理", "新增", "功能，" + function.toString());
                }
            }
        } else {
            // 更新
            StringBuilder stringBuilder = new StringBuilder("功能ID:[");
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(data);
            Function function;
            Function functionOld;
            for (JsonNode jsonNode : root) {
                function = new Function();
                function.setId(jsonNode.get("id").asLong());
                function.setName(jsonNode.get("name").asText());

                if (function.getId() > 0) {
                    functionOld = find(Function.class, function.getId());
                    if (functionOld != null && functionOld.getId() > 0) {
                        functionOld.setName(function.getName());
                        baseRepository.update(functionOld);
                        result = "success";
                    }
                    stringBuilder.append(function.getId()).append(",");
                }
            }
            log("权限管理", "更新", stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
        }
        objectNode.put("message", message);
        objectNode.put("result", result);
        objectNode.put("success", true);
        return objectNode.toString();
    }

    /**
     *
     * @param request
     * @param type 2->删除
     * @return
     */
    public ObjectNode multifunctionAuthFunctionAH(HttpServletRequest request, int type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("result", "failed");
        try {
            String[] ids = request.getParameterValues("ids");
            Function function = null;
            StringBuilder stringBuilder = new StringBuilder("广告ID:[");
            String typeStr = "";
            for (String num : ids) {
                long id = Long.parseLong(num);
                function = new Function();
                function.setId(id);
                function = baseRepository.find(Function.class, function.getId());
                if (function !=null && function.getId() > 0) {
                    if (type == 2) { // 删除
                        typeStr = "删除";
                        baseRepository.delete(Function.class, function.getId());
                    }
                    stringBuilder.append(function.getId()).append(",");
                }
            }
            log("权限管理", typeStr, stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
            objectNode.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("message", "");
        objectNode.put("success", true);
        return objectNode;
    }

    // 角色管理
    /**
     *
     * @param request
     * @return
     */
    public ObjectNode getRoleList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> params = new HashMap<String, Object>();
        String sql = "";
        sql = " WHERE 1 = 1";

        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE+"");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1+"");

        Page<Role> page = this.getPage(Role.class, sql, params, pageSize, pageNum);
        List<Role> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (Role m : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(m);
            jsonNode.put("function_names", getRoleFunctionList((int) m.getId(), true));
            jsonNode.put("function_ids", getRoleFunctionList((int) m.getId(), false));
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    public String updateAuthRoleFunction(HttpServletRequest request) throws Exception {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String result = "failed";
        boolean isVerify = true;
        String message = "";
        String typeStr = "新增";
        String id = request.getParameter("id");
        String name = request.getParameter("name");
        String[] functionIds = request.getParameter("function_ids").split(",");
        String description = request.getParameter("depict");

        if (StringUtils.isBlank(name)) {
            message = "名称不能为空";
            isVerify = false;
        }
        if (functionIds.length == 0) {
            message = "功能不能为空";
            isVerify = false;
        }
        if (isVerify) {
            Role role = new Role();
            role.setName(name);
            if (!StringUtils.isBlank(description)) {
                role.setDepict(description);
            }
            if (!StringUtils.isBlank(id)) {
                role.setId(Integer.parseInt(id));
                Role roleOld = find(Role.class, role.getId());
                if (role != null && role.getId() > 0) {
                    // 更新
                    roleOld.setName(role.getName());
                    baseRepository.update(roleOld);
                    typeStr = "更新";
                }
            } else {
                // 创建
                role.setId(baseRepository.create(role));
            }
            // 先删除在添加
            Map<String, Object> params = new HashMap<String, Object>();
            String sql = "";
            sql = " WHERE rId = :rId";
            params.put("rId", role.getId());
            List<RoleFunction> roleFunctionList = baseRepository.list(RoleFunction.class, sql, params);
            for (RoleFunction rf : roleFunctionList) {
                baseRepository.delete(RoleFunction.class, rf.getId());
            }
            RoleFunction roleFunction = null;
            for (String str : functionIds) {
                roleFunction = new RoleFunction();
                roleFunction.setrId((int) role.getId());
                roleFunction.setfId(Integer.parseInt(str));
                baseRepository.create(roleFunction);
            }
            result = "success";
            log("权限管理", typeStr, "角色，" + role.toString());
        }
        objectNode.put("message", message);
        objectNode.put("result", result);
        objectNode.put("success", true);
        return objectNode.toString();
    }

    // 查询功能列表
    public String getRoleFunctionList(int rId, boolean status) {
        Map<String, Object> params = new HashMap<String, Object>();
        String sql = " WHERE rId = :rId";
        params.put("rId", rId);
        StringBuilder stringBuilder = new StringBuilder();
        List<RoleFunction> roleFunctionList = baseRepository.list(RoleFunction.class, sql, params);
        for (RoleFunction rf : roleFunctionList) {
            if (status) {
                // 获取名称
                stringBuilder.append(find(Function.class, rf.getfId()).getName()).append(",");
            } else {
                // 获取ID
                stringBuilder.append(find(Function.class, rf.getfId()).getId()).append(",");
            }
        }
        return stringBuilder.toString().substring(0,stringBuilder.length()-1);
    }

    // 查权限角色列表
    public String getAuthRoleList(int uId, boolean status) {
        Map<String, Object> params = new HashMap<String, Object>();
        String sql = " WHERE uId = :uId";
        params.put("uId", uId);
        StringBuilder stringBuilder = new StringBuilder();
        List<AuthRole> authroleList = baseRepository.list(AuthRole.class, sql, params);
        for (AuthRole ar : authroleList) {
            if (status) {
                // 获取名称
                stringBuilder.append(find(Role.class, ar.getrId()).getName()).append(",");
            } else {
                // 获取ID
                stringBuilder.append(find(Role.class, ar.getrId()).getId()).append(",");
            }
        }
        return stringBuilder.toString().substring(0,stringBuilder.length()-1);
    }

    /**
     *
     * @param request
     * @param type 2->删除
     * @return
     */
    public ObjectNode multifunctionAuthRoleFunctionAH(HttpServletRequest request, int type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("result", "failed");
        try {
            String[] ids = request.getParameterValues("ids");
            Function function = null;
            StringBuilder stringBuilder = new StringBuilder("角色ID:[");
            String typeStr = "";
            for (String num : ids) {
                long id = Long.parseLong(num);
                Role role = new Role();
                role.setId(id);
                role = baseRepository.find(Role.class, role.getId());
                if (role !=null && role.getId() > 0) {
                    if (type == 2) { // 删除角色，与 功能角色表
                        typeStr = "删除";
                        Map<String, Object> params = new HashMap<String, Object>();
                        String sql = " WHERE rId = :rId";
                        params.put("rId", role.getId());
                        List<RoleFunction> roleFunctionList = baseRepository.list(RoleFunction.class, sql, params);
                        for (RoleFunction rf : roleFunctionList) {
                            baseRepository.delete(RoleFunction.class, rf.getId());
                        }
                        baseRepository.delete(Role.class, role.getId());
                    }
                    stringBuilder.append(role.getId()).append(",");
                }
            }
            log("权限管理", typeStr, stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
            objectNode.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("message", "");
        objectNode.put("success", true);
        return objectNode;
    }

    // 用户权限管理
    /**
     *
     * @param request
     * @return
     */
    public ObjectNode getAuthList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        Map<String, Object> params = new HashMap<String, Object>();
        String sql = "";
        sql = " WHERE 1 = 1";

        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE+"");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1+"");

        Page<Auth> page = this.getPage(Auth.class, sql, params, pageSize, pageNum);
        List<Auth> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (Auth m : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(m);
            jsonNode.put("role_names", getAuthRoleList((int) m.getuId(), true));
            jsonNode.put("role_ids", getAuthRoleList((int) m.getuId(), false));
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }


    public String updateAuth(HttpServletRequest request) throws Exception {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String result = "failed";
        boolean isVerify = true;
        String message = "";
        String id = request.getParameter("id");
        StringBuilder stringBuilder = new StringBuilder();
        if (StringUtils.isBlank(id)) {
            // 新增
            String[] roleIds = request.getParameter("role_ids").split(",");
            String[] user_ids = request.getParameter("user_ids").split(",");
            if (user_ids.length == 0) {
                message = "用户不能为空";
                isVerify = false;
            }
            if (roleIds.length == 0) {
                message = "角色不能为空";
                isVerify = false;
            }
            // 后台验证通过
            if (isVerify) {
                // 新增
                Auth auth = new Auth();
                Auth authNew = null;
                User user = null;
                for (String uId : user_ids) {
                    user = find(User.class, Integer.parseInt(uId));
                    for (String rId : roleIds) {
                        // 创建用户多个角色
                        AuthRole auth_role = new AuthRole();
                        auth_role.setuId((int) user.getId());
                        auth_role.setrId(Integer.parseInt(rId));
                        baseRepository.create(auth_role);
                    }
                    // 创建用户权限
                    authNew = new Auth();
                    authNew.setuId((int) user.getId());
                    authNew.setName(user.getAccount());
                    baseRepository.create(authNew);
                    stringBuilder.append(user.getAccount()).append(",");
                }
                // 执行保存的逻辑
                result = "success";
                log("权限管理", "新增", "权限，为：" + stringBuilder.toString().substring(0,stringBuilder.length()-1) + ",增加：" + getAuthRoleList((int) user.getId(),true));
            }
        } else {
            // 修改
            String[] roleIds = request.getParameter("role_ids").split(",");
            Auth auth = find(Auth.class, Long.parseLong(id));

            Map<String, Object> params = new HashMap<String, Object>();
            String sql = " WHERE uId = :uId";
            params.put("uId", auth.getuId());
            // 删除用户多个角色
            List<AuthRole> authRoleList = baseRepository.list(AuthRole.class, sql, params);
            for (AuthRole ar : authRoleList) {
                baseRepository.delete(AuthRole.class, ar.getId());
            }
            for (String rId : roleIds) {
                // 创建用户多个角色
                AuthRole auth_role = new AuthRole();
                auth_role.setuId(auth.getuId());
                auth_role.setrId(Integer.parseInt(rId));
                baseRepository.create(auth_role);
            }
            // 执行保存的逻辑
            result = "success";
            log("权限管理", "更新", "权限，" + auth.toString() + "," + getAuthRoleList(auth.getuId(),true));
        }
        objectNode.put("message", message);
        objectNode.put("result", result);
        objectNode.put("success", true);
        return objectNode.toString();
    }

    public String authDataNavs(HttpServletRequest request) throws Exception {
        User user = (User) request.getAttribute("user");

        // 判断是否有权限查看账号管理
        if (user.getStatus() == Constant.GENERAL_ID_NINE || getASRight(user.getId(), AUTH_USER)) { // 有权限管理必有账号管理
            return "{\"children\":[{\"text\":\"内容管理\",\"iconCls\":\"x-fa fa-newspaper-o\",\"expanded\":true,\"children\":[{\"text\":\"首页\",\"children\":[{\"viewType\":\"content-index-nav-main\",\"text\":\"主导航\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-nav-sub\",\"text\":\"次导航\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-notice\",\"text\":\"活动通知\",\"split\":true,\"leaf\":true},{\"text\":\"紫云法务\",\"children\":[{\"viewType\":\"content-index-embed-fawu-short\",\"text\":\"短期出家\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-embed-fawu-temple\",\"text\":\"入寺须知\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-embed-fawu-buddha\",\"text\":\"礼佛须知\",\"split\":true,\"leaf\":true}]},{\"viewType\":\"content-index-embed-futian\",\"text\":\"广种福田\",\"leaf\":true},{\"viewType\":\"content-index-embed-contact\",\"text\":\"联系我们\",\"leaf\":true},{\"viewType\":\"content-index-embed-focus\",\"text\":\"大焦点图\",\"leaf\":true}]},{\"viewType\":\"content-news\",\"text\":\"新闻法讯\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-life\",\"text\":\"生活禅\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-ziyunfoguo\",\"text\":\"紫云佛国\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-medical\",\"text\":\"禅医养生\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-knowledge\",\"text\":\"佛教常识\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-depository\",\"text\":\"藏经阁\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-waterzen\",\"text\":\"水墨禅韵\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-defaults\",\"text\":\"默认分类\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-recycle\",\"iconCls\":\"x-fa fa-trash\",\"text\":\"回收站\",\"leaf\":true}]},{\"text\":\"连载管理\",\"iconCls\":\"x-fa fa-desktop\",\"children\":[{\"viewType\":\"serial\",\"text\":\"连载列表\",\"leaf\":true}]},{\"text\":\"发布管理\",\"iconCls\":\"x-fa fa-desktop\",\"children\":[{\"viewType\":\"publish\",\"text\":\"发布记录\",\"leaf\":true}]},{\"text\":\"栏目维护\",\"iconCls\":\"x-fa fa-bars\",\"children\":[{\"viewType\":\"category\",\"text\":\"目录维护\",\"leaf\":true},{\"viewType\":\"template\",\"text\":\"模板维护\",\"leaf\":true},{\"viewType\":\"keyword\",\"text\":\"标签维护\",\"leaf\":true}]},{\"text\":\"媒体管理\",\"iconCls\":\"x-fa fa-cog\",\"children\":[{\"viewType\":\"media\",\"text\":\"媒体库\",\"leaf\":true}]},{\"text\":\"广告管理\",\"iconCls\":\"x-fa fa-cog\",\"children\":[{\"viewType\":\"ad\",\"text\":\"广告维护\",\"leaf\":true}]},{\"text\":\"账户资料\",\"iconCls\":\"x-fa fa-user\",\"children\":[{\"viewType\":\"account-setting\",\"text\":\"资料设置\",\"leaf\":true},{\"viewType\":\"account-editpwd\",\"text\":\"密码修改\",\"leaf\":true},{\"viewType\":\"account-mgrid\",\"text\":\"账号管理\",\"leaf\":true}]},{\"text\":\"系统安全\",\"iconCls\":\"x-fa fa-lock\",\"children\":[{\"viewType\":\"log\",\"text\":\"日志管理\",\"leaf\":true},{\"viewType\":\"auth-function\",\"text\":\"功能管理\",\"leaf\":true},{\"viewType\":\"auth-role\",\"text\":\"角色管理\",\"leaf\":true},{\"viewType\":\"auth-acl\",\"text\":\"用户管理\",\"leaf\":true}]}]}";
        } else if (getASRight(user.getId(), AUTH_ACCOUNT) && !getASRight(user.getId(), AUTH_USER)) { // 有账号管理未必有权限管理
            return "{\"children\":[{\"text\":\"内容管理\",\"iconCls\":\"x-fa fa-newspaper-o\",\"expanded\":true,\"children\":[{\"text\":\"首页\",\"children\":[{\"viewType\":\"content-index-nav-main\",\"text\":\"主导航\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-nav-sub\",\"text\":\"次导航\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-notice\",\"text\":\"活动通知\",\"split\":true,\"leaf\":true},{\"text\":\"紫云法务\",\"children\":[{\"viewType\":\"content-index-embed-fawu-short\",\"text\":\"短期出家\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-embed-fawu-temple\",\"text\":\"入寺须知\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-embed-fawu-buddha\",\"text\":\"礼佛须知\",\"split\":true,\"leaf\":true}]},{\"viewType\":\"content-index-embed-futian\",\"text\":\"广种福田\",\"leaf\":true},{\"viewType\":\"content-index-embed-contact\",\"text\":\"联系我们\",\"leaf\":true},{\"viewType\":\"content-index-embed-focus\",\"text\":\"大焦点图\",\"leaf\":true}]},{\"viewType\":\"content-news\",\"text\":\"新闻法讯\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-life\",\"text\":\"生活禅\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-ziyunfoguo\",\"text\":\"紫云佛国\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-medical\",\"text\":\"禅医养生\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-knowledge\",\"text\":\"佛教常识\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-depository\",\"text\":\"藏经阁\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-waterzen\",\"text\":\"水墨禅韵\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-defaults\",\"text\":\"默认分类\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-recycle\",\"iconCls\":\"x-fa fa-trash\",\"text\":\"回收站\",\"leaf\":true}]},{\"text\":\"连载管理\",\"iconCls\":\"x-fa fa-desktop\",\"children\":[{\"viewType\":\"serial\",\"text\":\"连载列表\",\"leaf\":true}]},{\"text\":\"发布管理\",\"iconCls\":\"x-fa fa-desktop\",\"children\":[{\"viewType\":\"publish\",\"text\":\"发布记录\",\"leaf\":true}]},{\"text\":\"栏目维护\",\"iconCls\":\"x-fa fa-bars\",\"children\":[{\"viewType\":\"category\",\"text\":\"目录维护\",\"leaf\":true},{\"viewType\":\"template\",\"text\":\"模板维护\",\"leaf\":true},{\"viewType\":\"keyword\",\"text\":\"标签维护\",\"leaf\":true}]},{\"text\":\"媒体管理\",\"iconCls\":\"x-fa fa-cog\",\"children\":[{\"viewType\":\"media\",\"text\":\"媒体库\",\"leaf\":true}]},{\"text\":\"广告管理\",\"iconCls\":\"x-fa fa-cog\",\"children\":[{\"viewType\":\"ad\",\"text\":\"广告维护\",\"leaf\":true}]},{\"text\":\"账户资料\",\"iconCls\":\"x-fa fa-user\",\"children\":[{\"viewType\":\"account-setting\",\"text\":\"资料设置\",\"leaf\":true},{\"viewType\":\"account-editpwd\",\"text\":\"密码修改\",\"leaf\":true},{\"viewType\":\"account-mgrid\",\"text\":\"账号管理\",\"leaf\":true}]}]}";
        } else { // 普通用户
            return "{\"children\":[{\"text\":\"内容管理\",\"iconCls\":\"x-fa fa-newspaper-o\",\"expanded\":true,\"children\":[{\"text\":\"首页\",\"children\":[{\"viewType\":\"content-index-nav-main\",\"text\":\"主导航\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-nav-sub\",\"text\":\"次导航\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-notice\",\"text\":\"活动通知\",\"split\":true,\"leaf\":true},{\"text\":\"紫云法务\",\"children\":[{\"viewType\":\"content-index-embed-fawu-short\",\"text\":\"短期出家\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-embed-fawu-temple\",\"text\":\"入寺须知\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-index-embed-fawu-buddha\",\"text\":\"礼佛须知\",\"split\":true,\"leaf\":true}]},{\"viewType\":\"content-index-embed-futian\",\"text\":\"广种福田\",\"leaf\":true},{\"viewType\":\"content-index-embed-contact\",\"text\":\"联系我们\",\"leaf\":true},{\"viewType\":\"content-index-embed-focus\",\"text\":\"大焦点图\",\"leaf\":true}]},{\"viewType\":\"content-news\",\"text\":\"新闻法讯\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-life\",\"text\":\"生活禅\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-ziyunfoguo\",\"text\":\"紫云佛国\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-medical\",\"text\":\"禅医养生\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-knowledge\",\"text\":\"佛教常识\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-depository\",\"text\":\"藏经阁\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-waterzen\",\"text\":\"水墨禅韵\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-defaults\",\"text\":\"默认分类\",\"split\":true,\"leaf\":true},{\"viewType\":\"content-recycle\",\"iconCls\":\"x-fa fa-trash\",\"text\":\"回收站\",\"leaf\":true}]},{\"text\":\"连载管理\",\"iconCls\":\"x-fa fa-desktop\",\"children\":[{\"viewType\":\"serial\",\"text\":\"连载列表\",\"leaf\":true}]},{\"text\":\"发布管理\",\"iconCls\":\"x-fa fa-desktop\",\"children\":[{\"viewType\":\"publish\",\"text\":\"发布记录\",\"leaf\":true}]},{\"text\":\"栏目维护\",\"iconCls\":\"x-fa fa-bars\",\"children\":[{\"viewType\":\"category\",\"text\":\"目录维护\",\"leaf\":true},{\"viewType\":\"template\",\"text\":\"模板维护\",\"leaf\":true},{\"viewType\":\"keyword\",\"text\":\"标签维护\",\"leaf\":true}]},{\"text\":\"媒体管理\",\"iconCls\":\"x-fa fa-cog\",\"children\":[{\"viewType\":\"media\",\"text\":\"媒体库\",\"leaf\":true}]},{\"text\":\"广告管理\",\"iconCls\":\"x-fa fa-cog\",\"children\":[{\"viewType\":\"ad\",\"text\":\"广告维护\",\"leaf\":true}]},{\"text\":\"账户资料\",\"iconCls\":\"x-fa fa-user\",\"children\":[{\"viewType\":\"account-setting\",\"text\":\"资料设置\",\"leaf\":true},{\"viewType\":\"account-editpwd\",\"text\":\"密码修改\",\"leaf\":true}]}]}";
        }
    }

    public boolean getASRight(long userId, int functionId) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("userId", userId);
        param.put("functionId", functionId);
        String sql = "SELECT COUNT(1) " +
                "FROM " +
                config.getDbName() + "_user AS u, " +
                config.getDbName() + "_role AS r, " +
                config.getDbName() + "_authrole AS ar, " +
                config.getDbName() + "_rolefunction AS rf " +
                "WHERE " +
                "u.id = :userId " +
                "AND rf.fId = :functionId " +
                "AND u.status > 0 " +
                "AND ar.uId = u.id " +
                "AND rf.rId = r.id " +
                "AND rf.rId = ar.rId";

        Integer count = jdbcTemplate.queryForObject(sql, param, Integer.class);

        return (count > 0);
    }
}