package com.core.service;

import com.core.domain.*;
import com.core.util.IpUtil;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by yk on 2017/5/27.
 */
@Service
public class SerialService extends BaseService {

    private Log log = new Log();

    /**
     * 连载list
     *
     * @param start
     * @param limit
     * @return
     */
    public ObjectNode serialList(int start, int limit) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        Map<String, Object> params = new HashMap<>();
        params.put("start", start);
        params.put("limit", limit);
        int count = count(Serial.class, "");
        List<Serial> serials = list(Serial.class, " ORDER BY updateDate DESC, createDate DESC LIMIT :start, :limit", params);

        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (int i = 0; i < serials.size(); i++) {
            Serial serial = serials.get(i);
            ObjectNode objectNode1 = objectMapper.valueToTree(serial);
            Template template = find(Template.class, serial.gettId());
            objectNode1.put("fileName", template.getFileName());
            arrayNode.add(objectNode1);
        }

        objectNode.put("rows", arrayNode);
        objectNode.put("total", count);
        return objectNode;
    }

    /**
     * serial 修改 删除
     *
     * @param method
     * @param data
     * @param account
     * @return
     */
    public ObjectNode serialBtn(String method, String data, String account, int[] ids) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        log.setIp(IpUtil.getIp(request));
        log.setAccount(account);
        log.setName("连载管理");
        String idsStr = "";

        ArrayNode arrayNode;
        try {
            if ("remove".equals(method)) {
                for (int i = 0; i < ids.length; i++) {
                    // 如果已有连载，不允许删除
                    List<Article> articles = list(Article.class, String.format(" WHERE sId = %s", ids[i]));
                    if (articles.size() == 0){
                        delete(Serial.class, ids[i]);
                    }
                }
                log.setAction("删除");
                log.setContent(Arrays.toString(ids));
            } else if ("save".equals(method)) {
                log.setAction("修改");
                arrayNode = objectMapper.readValue(data, ArrayNode.class);
                for (int i = 0; i < arrayNode.size(); i++) {
                    ObjectNode objectNode1 = objectMapper.readValue(arrayNode.get(i), ObjectNode.class);
                    objectNode1.remove("fileName");
                    Serial serial = objectMapper.readValue(objectNode1, Serial.class);

                    idsStr += serial.getId() + ",";
                    serial.setUpdateDate(new Date());
                    update(serial);
                }
                idsStr = idsStr.contains(",") ? idsStr.substring(0, idsStr.lastIndexOf(",")) : idsStr;
                log.setContent("操作ID：" + idsStr);
            }

            log.setCreateDate(new Date());
            create(log);
            objectNode.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            objectNode.put("success", false);
        }

        return objectNode;
    }

    /**
     * 新增连载
     *
     * @return
     */
    public ObjectNode createSerial() {
        ObjectNode objectNode1 = objectMapper.createObjectNode();
        User user = (User) request.getAttribute("user");
        String name = request.getParameter("name");
        String depict = request.getParameter("depict");
        String tIdStr = request.getParameter("tId");
        int tId = 0;
        if (!StringUtils.isBlank(tIdStr)) {
            tId = Integer.parseInt(tIdStr);
        }

        Serial serial = new Serial();
        serial.setName(name);
        serial.setDepict(depict);
        serial.settId(tId);
        serial.setStatus(5);
        serial.setCreateDate(new Date());
//        serial.setUrl("需要创建URL");
        try {
            long serialId = create(serial);
            if (serialId > 0) {
                String path = config.getListSerialParam();
                path = config.getListDomain() + String.format(path, serialId);
                serial.setUrl(path);
                serial.setId(serialId);
                update(serial);
            }

            log.setName("连载管理");
            log.setAction("新增");
            log.setIp(IpUtil.getIp(request));
            log.setContent("新增连载：" + name);
            log.setAccount(user.getAccount());
            log.setCreateDate(new Date());
            create(log);
            objectNode1.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            objectNode1.put("success", false);
            objectNode1.put("msg", e.getMessage());
        }
        return objectNode1;
    }

    /**
     * 查询根据条件查询
     *
     * @return
     */
    public ObjectNode serialQuery(int status) {
        ObjectNode objectNode1 = objectMapper.createObjectNode();

        Map<String, Object> params = new HashMap<>();
        params.put("status", status);
        List<Serial> serials = list(Serial.class, " WHERE status = :status ORDER BY updateDate DESC, createDate DESC", params);
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (int i = 0; i < serials.size(); i++) {
            arrayNode.add(objectMapper.valueToTree(serials.get(i)));
        }
        objectNode1.put("rows", arrayNode);
        return objectNode1;
    }

    /**
     * 根据ID查询serial
     *
     * @param id
     * @return
     */
    public ObjectNode serialQueryForId(long id) {
        ObjectNode objectNode1 = objectMapper.createObjectNode();
        if (id == 0) {
            return objectNode1;
        }
        Serial serial = find(Serial.class, id);

        objectNode1.put("rows", objectMapper.valueToTree(serial));
        return objectNode1;
    }

}
