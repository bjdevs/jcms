package com.core.security;

import com.core.domain.Session;
import com.core.domain.User;
import com.core.repository.SecurityRepository;
import com.core.util.Constant;
import com.core.util.EncryptUtil;
import com.core.util.ProjectUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.*;

/**
 * Created by sun
 */
public class SecuritySupport {
    private Log logger = LogFactory.getLog(this.getClass());

    private final static String TOOKEN_COOKIE_NAME = "_sn_";

    @Autowired
    private SecurityRepository securityRepository;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private HttpServletRequest request;

    public SecuritySupport() {}

    public ObjectNode login(HttpServletResponse response) {
        String message = "";
        ObjectNode objectNode = objectMapper.createObjectNode();
        try {
            String account = request.getParameter("account");
            String password = request.getParameter("password");
            ObjectNode msg = objectMapper.createObjectNode();

            // 后台检查用户输入信息
            String result = "failed";
            boolean isCheck = true;

            if (StringUtils.isBlank(account)) {
                message = "账户不能为空";
                isCheck = false;
            }
            if (StringUtils.isBlank(password)) {
                message = "密码不能为空";
                isCheck = false;
            }
            // 通过
            if (isCheck) {
                Map<String, Object> param = new HashMap<String, Object>();
                param.put("account", account);
                param.put("password", EncryptUtil.md5(password));
                //param.put("status", Constant.GENERAL_ID_ONE);
                User user = findAccount(User.class, param);
                if (user != null && user.getId() > 0) {
                    // 登录权限status 必须大于0
                    if (user.getStatus() > Constant.GENERAL_ID_ZERO) {
                        createSession(response, user.getAccount(), user.getId());
                        user.setLastLoginDate(new Date());
                        securityRepository.update(user);
                        result = "success";
                        // 此处记录日志
                    } else {
                        message = "账号："+user.getAccount()+"，没有登录权限";
                    }
                } else {
                    message = "账户名或账户密码输入错误";
                }
            }
            objectNode.put("result", result);
            objectNode.put("message", message);
            objectNode.put("success", true);
            return objectNode;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 查用户
     * @param tClass
     * @param param
     * @param <T>
     * @return
     */
    private <T> T findAccount(Class<T> tClass, Map<String, Object> param) {
        StringBuffer sql = new StringBuffer();
        T t = null;
        try {
            t = tClass.newInstance();

            if (param != null && param.size() != 0) {
                int size = param.size();
                int count = 0;
                sql.append(" WHERE");
                for (String key : param.keySet()) {
                    count++;
                    sql.append(" ");
                    sql.append(key);
                    sql.append("= :");
                    sql.append(key);
                    if (count < size) {
                        sql.append(" AND");
                    }
                }
            }

            List<T> list = securityRepository.list(tClass, sql.toString(), param);
            if (list != null && list.size() != 0) {
                t = list.get(0);
            }
        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
        return t;
    }

    /**
     * 保存Session
     * @param response
     * @param account
     * @param id
     */
    @Transactional
    private void createSession(HttpServletResponse response, String account, long id) {

        String sessionKey = EncryptUtil.md5(account + ":" + System.currentTimeMillis());
        try {
            Session session = new Session();
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, +1);
            calendar.add(Calendar.DAY_OF_MONTH, +6);
            session.setLoginDate(new Date());
            session.setExpireDate(calendar.getTime());
            session.setSessionKey(sessionKey);
            session.setAccount(account);

            session.setStatus(Constant.GENERAL_ID_ONE);
            session.setUserId(id);

            securityRepository.create(session);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e);
            throw new RuntimeException("");
        }

        Cookie cookie = new Cookie(TOOKEN_COOKIE_NAME, sessionKey);
        // cookie.setSecure(true);
        cookie.setDomain(request.getServerName());
        cookie.setPath("/");
        // 一周
        cookie.setMaxAge(604800);
        response.addCookie(cookie);
    }

    /**
     * 退出
     * @param response
     */
    public void logout(HttpServletResponse response) {
        try {
            String cookieValue = getCookie(TOOKEN_COOKIE_NAME);
            Session session = findSession(cookieValue);
            if (session != null && session.getId() > 0) {
                securityRepository.delete(Session.class, session.getId());
            }
            deleteCookie(response, cookieValue);
            //根据生成随机数决定是否删除Session表中过期数据
            if ((int)(1 + Math.random() * 100) == 30) {
                clearSessionExpireDate();
            };
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e);
        }
    }

    /**
     * 删除Cookie
     * @param response
     * @param cookieValue
     */
    public void deleteCookie(HttpServletResponse response, String cookieValue) {
        if (StringUtils.isNotBlank(cookieValue)) {
            Cookie cookie = new Cookie(TOOKEN_COOKIE_NAME, cookieValue);
            cookie.setPath("/");
            cookie.setDomain(request.getServerName());
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
    }

    private String getCookie(String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (int i = 0, c = cookies.length; i < c; ++i) {
                Cookie cookie = cookies[i];
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public Session findSession(String key) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("sessionKey", key);
        param.put("status", Constant.GENERAL_ID_ONE);

        List<Session> list = securityRepository.list(Session.class, " WHERE sessionKey = :sessionKey AND status = :status ", param);
        if (list != null && list.size() != 0) {
            return list.get(0);
        }

        return null;
    }

    /**
     * 查询 Session 已过期数据
     * @return
     */
    public List<Session> listAllExpireDateSession() {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("expireDate", new Date());
        List<Session> list = securityRepository.list(Session.class, " WHERE :expireDate > expireDate", param);
        if (list != null && list.size() != 0) {
            return list;
        }
        return null;
    }

    /**
     * 清理已过期的Session数据
     * @return
     */
    public void clearSessionExpireDate() {
        List<Session> sessionList = listAllExpireDateSession();
        if (sessionList.size() == 0) {
            return;
        }
        for (Session session : sessionList) {
            // 清理过期 Cache 与 数据库
            securityRepository.delete(Session.class, session.getId());
        }
    }

    /**
     * 获取数据库中sessin与user数据
     * @return
     */
    public User getUserInfo() {
        Session session = recognize();
        User user = null;
        if (session != null) {
            user = getUserInfo(session.getUserId(), session.getAccount(), null);
        }
        return user;
    }

    public User getUserInfo(long id, String account, String password) {
        User user = new User();
        Map<String, Object> param = new HashMap<String, Object>();
        if (id > 0) {
            param.put("id", id);
        }
        if (StringUtils.isNotBlank(password)) {
            param.put("password", password);
        }
        param.put("account", account);
        //param.put("status", Constant.GENERAL_ID_ONE);

        User userInfo = findAccount(User.class, param);
        if (userInfo != null && userInfo.getId() != 0) {
            user.setId(userInfo.getId());
            user.setAccount(userInfo.getAccount());
            user.setName(userInfo.getName());
            user.setPhone(userInfo.getPhone());
            user.setMail(userInfo.getMail());
            user.setDepict(userInfo.getDepict());
            user.setCreateDate(userInfo.getCreateDate());
            user.setUpdateDate(userInfo.getUpdateDate());
            user.setLastLoginDate(userInfo.getLastLoginDate());
        }
        return user;
    }

    /**
     * 获取session
     * @return
     */
    private Session recognize() {
        String sessionKey = getCookie(TOOKEN_COOKIE_NAME);
        Session session = null;
        if (StringUtils.isNotBlank(sessionKey)) {
            session = findSession(sessionKey);
        }
        return session;
    }


    /**
     * 查询是否为管理员
     * @param user
     * @return true 是管理员 false 不是
     */
    public boolean isAdmin(User user) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("id", user.getId());
        int num = securityRepository.count(User.class, " WHERE id = :id and status = 9", param);
        if (num == 0) {
            return false;
        } else {
            return true;
        }
    }

    public boolean hasRight(long userId, Method method) throws Exception {
        return securityRepository.hasRight(userId, method);
    }

}
