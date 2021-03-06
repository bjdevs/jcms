package com.core.service;

import com.core.config.Config;
import com.core.domain.User;
import com.core.repository.BaseRepository;
import com.core.repository.sqlBuilder.Page;
import com.core.security.SupportFactory;
import com.core.util.Constant;
import com.core.util.IpUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by sun on 2017/4/19.
 */
public class BaseService {
    protected final Log logger = LogFactory.getLog(this.getClass());

    @Autowired
    protected BaseRepository baseRepository;

    @Autowired
    protected SupportFactory supportFactory;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected HttpServletRequest request;

    @Autowired
    protected Config config;

    private int PAGE_SIZE_DEFAULT = 25;

    private int PAGE_NUM_DEFAULT = 1;

    public <T> List<T> list(Class<T> type) {
        return baseRepository.list(type, null, null);
    }

    public <T> List<T> list(Class<T> type, String sql) {
        return baseRepository.list(type, sql, null);
    }

    public <T> List<T> list(Class<T> type, String sql, Map<String, Object> param) {
        return baseRepository.list(type, sql, param);
    }

    public <T> T search(Class<T> type) {
        return search(type, null, null);
    }

    public <T> T search(Class<T> type, String sql) {
        return search(type, sql, null);
    }

    public <T> T search(Class<T> type, String sql, Map<String, Object> params) {
        return null;
    }

    public <T> T find(Class<T> type, long id) {
        T t = null;
        try {
            t = baseRepository.find(type, id);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e);
        }
        return t;
    }

    public <T> int count(Class<T> type, String sql, Map<String, Object> params) {
        return baseRepository.count(type, sql, params);
    }

    public <T> int count(Class<T> type, String sql) {
        return baseRepository.count(type, sql, null);
    }

    public <T> int count(Class<T> type) {
        return baseRepository.count(type, null, null);
    }

    public <T> Page<T> getPage(Class<T> type, String sql, Map<String, Object> param, int pageSize, int pageNum) {
        Page<T> page = new Page<T>();

        if (pageNum > 0) {
            page.setPageNum(pageNum);
        } else {
            page.setPageNum(PAGE_NUM_DEFAULT);
        }

        if (pageSize > 0) {
            page.setPageSize(pageSize);
        } else {
            page.setPageSize(PAGE_SIZE_DEFAULT);
        }

        page.setTotalData(baseRepository.count(type, sql, param));

        pageNum = pageNum > page.getTotalPage() && page.getTotalPage() != 0 ? page.getTotalPage() : pageNum;

        page.setPageNum(pageNum);

        page.setResultList(baseRepository.pageList(type, sql, param, pageSize, pageNum));

        return page;
    }

    public void log(String name, String action, String content) throws Exception {
        User user = (User) request.getAttribute("user");
        if (user == null || user.getId() == 0) {
            user = supportFactory.getSecuritySupport().getUserInfo();
        }
        com.core.domain.Log log = new com.core.domain.Log();
        log.setAccount(user.getAccount());
        log.setName(name);
        log.setAction(action);
        if (content.length() > 255) {
            content = content.substring(0,254);
        }
        log.setContent(content);
        log.setIp(IpUtil.getIp(request));
        log.setCreateDate(new Date());
        baseRepository.create(log);
    }

    public long create(Object object) {
        try {
            return baseRepository.create(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void update(Object object) {
        try {
            baseRepository.update(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public <T> void delete(Class<T> type, long id){
        baseRepository.delete(type, id);
    }

    /**
     * 建立文本数组
     *
     * @param content
     * @return
     */
    final String KEY_WORD = "<hr style=\"page-break-after:always;\" class=\"ke-pagebreak\" />";
    final String KEY_WORD2 = "-{30}以下第\\d{1,}页?-{30}";
    public String[] builderContentArray(String content) {

        String targetStr = content;

        // 文章分页功能
        // 分页符 -> 分页标记
        int num = 1;
        while (targetStr.indexOf(KEY_WORD) > 0) {
            targetStr = targetStr.replaceFirst(KEY_WORD, "<span style=\"background-color:#FFE500;\">------------------------------以下第" + num + "页------------------------------</span>");
            num++;
        }

        StringBuffer stringBuffer = new StringBuffer();
        String[] strs = targetStr.split(KEY_WORD2);
        for (int i = 0; i < strs.length; i++) {
            if (i > 0) {
                stringBuffer.append("<span style=\"background-color:#FFE500;\">------------------------------以下第" + (i+1) + "页------------------------------</span>");
            }
            stringBuffer.append(checkPLable(strs[i]));
        }
        targetStr = stringBuffer.toString();
        stringBuffer.setLength(0);
        content = targetStr;

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
     * 检查P标签是否闭合
     * @param str
     * @return
     */
    public static String checkPLable(String str) {
        StringBuffer stringBuffer = new StringBuffer();
        boolean isAdd = false;
        // 检查开头
        if (str.indexOf("<p>") > str.indexOf("</p>")) {
            stringBuffer.append("<p>").append(str);
            str = stringBuffer.toString();
            isAdd = true;
        }
        // 检查结尾
        if (str.lastIndexOf("<p>") > str.lastIndexOf("</p>")) {
            if (!isAdd) {
                stringBuffer.append(str).append("</p>");
            }  else {
                stringBuffer.append("</p>");
            }
            str = stringBuffer.toString();
        }
        stringBuffer.setLength(0);
        return str;
    }
}
