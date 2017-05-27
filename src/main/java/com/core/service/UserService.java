package com.core.service;

import com.core.domain.User;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import com.core.util.EncryptUtil;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sun on 2017/4/19.
 */
@Service
public class UserService extends BaseService {

    /**
     * 用户列表
     * @param request
     * @return
     */
    public ObjectNode getList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE + "");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1 + "");
        Map<String, Object> params = new HashMap<String, Object>();
        // 列表页过滤管理员账号
        params.put("id", 1);
        String sql = " WHERE id > :id";

        Page<User> page = this.getPage(User.class, sql, params, pageSize, pageNum);
        List<User> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();

        for (User m : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(m);
            arrayNode.add(jsonNode);
        }

        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 查
     * @param id
     * @return
     */
    public User findUser(int id) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("id", id);

        List<User> list = list(User.class, " WHERE id = :id ", param);
        if (list == null || list.size() == 0) {
            return null;
        }
        return list.get(0);
    }

    /**
     * 更新
     *
     * @param request
     * @return
     */
    public ObjectNode updateAccount(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String result = "failed";
        objectNode.put("message", "");
        objectNode.put("success", true);
        try {
            String data = request.getParameter("data");
            StringBuilder stringBuilder = new StringBuilder("用户ID:[");
            User user = null;
            User userOld = null;
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(data);
            for (JsonNode jsonNode : root) {
                user = new User();
                user.setId(jsonNode.get("id").asLong());
                user.setName(jsonNode.get("name").asText());
                user.setPhone(jsonNode.get("phone").asText());
                user.setMail(jsonNode.get("mail").asText());
                if (!StringUtils.isBlank(jsonNode.get("depict").asText())) {
                    user.setDepict(jsonNode.get("depict").asText());
                }
                if (user.getId() > 0) {
                    userOld = find(User.class, user.getId());
                    if (userOld != null && userOld.getId() > 0) {
                        userOld.setName(user.getName());
                        userOld.setPhone(user.getPhone());
                        userOld.setMail(user.getMail());
                        if (!StringUtils.isBlank(user.getDepict())) {
                            userOld.setDepict(user.getDepict());
                        }
                        userOld.setUpdateDate(new Date());
                        baseRepository.update(userOld);
                        stringBuilder.append(userOld.getId()).append(",");
                    }
                }
                result = "success";
                objectNode.put("result", result);
                log("用户管理", "更新", stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return objectNode;
    }

    public ObjectNode createAccount(User user) {
        try {
            ObjectNode objectNode = objectMapper.createObjectNode();

            boolean isUser = true;
            String message = "";
            String result = "failed";
            if (StringUtils.isBlank(user.getAccount())) {
                message = "账号名不能为空";
                isUser = false;
            }
            if (StringUtils.isBlank(user.getPassword())) {
                message = "密码不能为空";
                isUser = false;
            }
            if (StringUtils.isBlank(user.getPhone())) {
                message = "手机号码不能为空";
                isUser = false;
            }
            if (StringUtils.isBlank(user.getPhone())) {
                message = "手机号码不能为空";
                isUser = false;
            }
            if (StringUtils.isBlank(user.getMail())) {
                message = "邮箱不能为空";
                isUser = false;
            }
            if (isUser) {
                // 继续验证
                User account = findAccount(user.getAccount());
                if (account != null && account.getId() > 0) {
                    isUser = false;
                    message = "已有人使用了该账号：" + account.getAccount() + "，请尝试其他用账号";
                }
            }
            if (isUser) {
                // 验证通过
                user.setPassword(EncryptUtil.md5(user.getPassword()));
                user.setCreateDate(new Date());
                user.setUpdateDate(new Date());
                user.setLastLoginDate(new Date());
                user.setStatus(Constant.GENERAL_ID_ONE);
                user.setId(baseRepository.create(user));
                result = "success";
                // Log in to the database
                log("用户管理", "新增", user.toString());
            }
            objectNode.put("result", result);
            objectNode.put("success", true);
            objectNode.put("message", message);
            return objectNode;
        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
    }

    public User findAccount(String account) {

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("account", account);

        List<User> list = list(User.class, " WHERE account = :account ", param);
        if (list == null || list.size() == 0) {
            return null;
        }
        return list.get(0);

    }

    /**
     * @param request
     * @param type    0->废弃,1->启用,2->删除
     * @return
     */
    public ObjectNode multifunctionAccountAH(HttpServletRequest request, int type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("result", "failed");
        objectNode.put("message", "");
        objectNode.put("success", true);
        try {
            String[] ids = request.getParameterValues("ids");
            StringBuilder stringBuilder = new StringBuilder("广告ID:[");
            String typeStr = "";
            User user = null;
            for (String num : ids) {
                long id = Long.parseLong(num);
                user = new User();
                user.setId(id);
                user = baseRepository.find(User.class, user.getId());
                if (user != null && user.getId() > 0) {
                    user.setUpdateDate(new Date());
                    if (type == 0) { // 禁用
                        user.setStatus(Constant.GENERAL_ID_ZERO);
                        typeStr = "废弃";
                        baseRepository.update(user);
                    }
                    if (type == 1) { // 启用
                        user.setStatus(Constant.GENERAL_ID_ONE);
                        typeStr = "启用";
                        baseRepository.update(user);
                    }
                    objectNode.put("result", "success");
                    stringBuilder.append(user.getId()).append(",");
                }
            }
            log("用户管理", typeStr, stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return objectNode;
    }

    public ObjectNode updateInfo(User user) {
        try {
            ObjectNode objectNode = objectMapper.createObjectNode();
            User userInfo = (User) request.getAttribute("user");
            User _user = new User();
            if (user.getId() > 0) {
                _user = find(User.class, userInfo.getId());
            }
            _user.setName(user.getName());
            _user.setPhone(user.getPhone());
            _user.setMail(user.getMail());
            _user.setDepict(user.getDepict());
            _user.setUpdateDate(new Date());
            if (user.getId() > 0) {
                // 更新
                baseRepository.update(_user);
            } else {
                _user.setPassword(EncryptUtil.md5(user.getPassword()));
                _user.setCreateDate(new Date());
                // 新增
                baseRepository.create(_user);
            }
            objectNode.put("result", "success");
            objectNode.put("success", true);
            log("用户管理", "更新", user.toString());
            return objectNode;

        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
    }

    public ObjectNode changePassWord(User user) {
        try {
            ObjectNode objectNode = objectMapper.createObjectNode();
            // 后台检查用户输入信息
            String result = "failed";
            boolean isCheck = true;
            int id = Integer.parseInt(request.getParameter("id"));
            String oldPassword = request.getParameter("old-password");
            String newPassword = request.getParameter("new-password");
            String rePassword = request.getParameter("re-password");
            if (StringUtils.isBlank(oldPassword)) {
                objectNode.put("password", "旧密码不能为空");
                isCheck = false;
            }
            if (StringUtils.isBlank(newPassword)) {
                objectNode.put("password", "新密码不能为空");
                isCheck = false;
            }
            if (StringUtils.isBlank(rePassword)) {
                objectNode.put("password", "密码确认不能为空");
                isCheck = false;
            }
            if (!EncryptUtil.md5(newPassword).equals(EncryptUtil.md5(rePassword))) {
                objectNode.put("password", "输入的两次新密码不相同,请重新输入");
                isCheck = false;
            }
            if (isCheck) {
                Map<String, Object> param = new HashMap<String, Object>();
                User _user = findUser(id);
                if (_user != null && _user.getId() > 0) {
                    if (!EncryptUtil.md5(oldPassword).equals(_user.getPassword())) {
                        objectNode.put("password", "旧密码验证错误，请重新输入");
                        isCheck = false;
                    }
                    if (EncryptUtil.md5(rePassword).equals(_user.getPassword())) {
                        objectNode.put("password", "新密码不能与旧密码相同，请重新输入");
                        isCheck = false;
                    }
                    if (isCheck) {
                        _user.setPassword(EncryptUtil.md5(rePassword));
                        baseRepository.update(_user);
                        result = "success";
                    }
                }
            }
            objectNode.put("result", result);
            objectNode.put("success", true);
            log("用户管理", "更新", "密码修改:"+user.toString());
            return objectNode;
        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
    }
}
