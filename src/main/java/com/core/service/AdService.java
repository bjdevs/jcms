package com.core.service;

import com.core.domain.Ad;
import com.core.domain.User;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;

/**
 * Created by sun on 2017/5/2.
 */
@Service
public class AdService extends BaseService {

    /**
     *
     * @param request
     * @return
     */
    public ObjectNode getList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        String title = request.getParameter("name");
        String startDate = request.getParameter("startdate");
        String endDate = request.getParameter("enddate");
        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE+"");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1+"");
        String sql = "";
        sql = " WHERE 1 = 1";
        Map<String, Object> params = new HashMap<String, Object>();
        if (!StringUtils.isBlank(title)) {
            params.put("name", title);
            sql += " AND name = :name";
        }
        if (!StringUtils.isBlank(startDate) && !StringUtils.isBlank(endDate)
                && startDate.length() > 5 && endDate.length() > 5) {
            params.put("createDate", startDate);
            params.put("endDate", endDate.replace("00:00:00","23:59:59"));
            sql += " AND updateDate > :createDate AND updateDate < :endDate";
        }

        Page<Ad> page = this.getPage(Ad.class, sql, params, pageSize, pageNum);
        List<Ad> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();

        for (Ad ad : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(ad);
            jsonNode.put("user",find(User.class,ad.getuId()).getAccount());
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    public String createAd(HttpServletRequest request) throws Exception {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String result = "failed";
        boolean isVerify = true;
        String message = "";
        String name = request.getParameter("name");
        String location = request.getParameter("location");
        String size = request.getParameter("size");
        String url = request.getParameter("url");
        String materialUrl = request.getParameter("materialUrl");
        if (StringUtils.isBlank(name)) {
            message = "标题不能为空";
            isVerify = false;
        }
        if (StringUtils.isBlank(size)) {
            message = "广告尺寸不能为空";
            isVerify = false;
        }
        if (StringUtils.isBlank(name)) {
            message = "标题不能为空";
            isVerify = false;
        }
        if (StringUtils.isBlank(url)) {
            message = "地址不能为空";
            isVerify = false;
        }
        if (StringUtils.isBlank(materialUrl)) {
            message = "素材地址不能为空";
            isVerify = false;
        }
        if (StringUtils.isBlank(location)) {
            message = "广告位置不能为空";
            isVerify = false;
        }/* else {
            boolean exist = false;
            // 检查是否可以新增位置
            Iterator<Map.Entry<String, String>> iterator = locationData.entrySet().iterator();
            while(iterator.hasNext()) {
                Map.Entry entry = iterator.next();
                if (location.equals((String) entry.getKey())) {
                    exist = true;
                    // 检查数据库是否存在此位置的广告
                    if (getAvailableList(location) > 0) {
                        isVerify = false;
                        message = "广告位置：" + entry.getKey() + "已存在，无法新增";
                        break;
                    }
                }
            }
            if (!exist) {
                isVerify = false;
                message = "广告位置：" + location + "不存在，无法新增";
            }
        }*/
        // 后台验证通过
        if (isVerify) {
            // 新增
            User userInfo = (User) request.getAttribute("user");
            Ad ad = new Ad();
            ad.setName(name);
            ad.setLocation(location);
            ad.setSize(size);
            ad.setUrl(url);
            ad.setMaterialUrl(materialUrl);
            ad.setCreateDate(new Date());
            ad.setUpdateDate(new Date());
            ad.setStatus(Constant.GENERAL_ID_ONE);
            ad.setuId((byte) userInfo.getId());
            ad.setId(baseRepository.create(ad));
            // 执行保存的逻辑
            result = "success";
            log("广告管理", "新增", ad.toString());
        }
        objectNode.put("message", message);
        objectNode.put("result", result);
        objectNode.put("success", true);
        return objectNode.toString();
    }

    /**
     *
     * @param request
     * @param type // 删除2 -> 废弃0 -> 待审1 -> 已审3 -> 已发9
     * @return
     */
    public ObjectNode multifunctionAdAH(HttpServletRequest request, int type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        String message = "";
        String result = "failed";
        try {
            String[] ids = request.getParameterValues("ids");
            Ad ad = null;
            StringBuilder stringBuilder = new StringBuilder("");
            String typeStr = "";
            for (String num : ids) {
                long id = Long.parseLong(num);
                ad = new Ad();
                ad.setId(id);
                ad = baseRepository.find(Ad.class, ad.getId());
                if (ad !=null && ad.getId() > 0) {
                    ad.setUpdateDate(new Date());
                    if (type == Constant.GENERAL_ID_TWO) { // 删除
                        if (ad.getStatus() == Constant.GENERAL_ID_ZERO) { // 只有广告是废弃才可以删除
                            typeStr = "删除";
                            stringBuilder.append(ad.toString()).append(",");
                            baseRepository.delete(Ad.class, ad.getId());
                            result = "success";
                        } else {
                            message = "当前状态不是废弃，无法删除";
                        }
                    } else if (type == Constant.GENERAL_ID_ZERO) { // 废弃
                        if (getAvailableList(ad.getLocation(), Constant.GENERAL_ID_ZERO) > 1) { // 只有两个同位置的状态大于等于待审的广告才允许删除
                            ad.setStatus(Constant.GENERAL_ID_ZERO);
                            ad.setUpdateDate(new Date());
                            typeStr = "废弃";
                            baseRepository.update(ad);
                            result = "success";
                        } else {
                            message = "只有最后一个广告了，不允许废弃";
                        }
                    } else if (type == Constant.GENERAL_ID_THREE) { // 已审
                        if (getAvailableList(ad.getLocation(), Constant.GENERAL_ID_TWO) == 0 ) { // 有且只有 一个 已审 / 已发 就不允许审核通过
                            ad.setStatus(Constant.GENERAL_ID_THREE);
                            ad.setUpdateDate(new Date());
                            typeStr = "已审";
                            baseRepository.update(ad);
                            result = "success";
                        } else {
                            message = "当前位置：" + ad.getLocation() + "，已存在已审或已发的广告";
                        }
                    } else if (type == Constant.GENERAL_ID_NINE) { // 已发
                        if (ad.getStatus() == Constant.GENERAL_ID_THREE) {
                            a
                            ad.setStatus(Constant.GENERAL_ID_NINE);
                            ad.setUpdateDate(new Date());
                            typeStr = "已发";
                            baseRepository.update(ad);
                            result = "success";
                        } else {
                            message = "当前位置不是已审广告，不允许发布";
                        }
                    }
                    if (type != Constant.GENERAL_ID_TWO) {
                        if ("failed".equals(result)) {
                            typeStr = "失败";
                            stringBuilder.append(message);
                        }
                        stringBuilder.append(ad.toString()).append(",");
                        if ("failed".equals(result)) {
                            break;
                        }
                    }
                }
            }
            log("广告管理", typeStr, stringBuilder.toString().substring(0,stringBuilder.length()-1));
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("result", result);
        objectNode.put("message", message);
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 更新
     * @param request
     * @return
     */
    public ObjectNode updateAd(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("result", "failed");
        try {
            String data = request.getParameter("data");
            StringBuilder stringBuilder = new StringBuilder("广告ID:[");
            String typeStr = "";
            Ad ad = null;
            Ad adOld = null;
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(data);
            for (JsonNode jsonNode : root) {
                ad = new Ad();
                ad.setId(jsonNode.get("id").asLong());
                ad.setName(jsonNode.get("name").asText());
                ad.setUrl(jsonNode.get("url").asText());
                ad.setSize(jsonNode.get("size").asText());
                ad.setMaterialUrl(jsonNode.get("materialUrl").asText());
                ad.setStatus((byte) jsonNode.get("status").asInt());

                if (ad.getId() > 0) {
                    adOld = find(Ad.class, ad.getId());
                    if (adOld != null && adOld.getId() > 0) {
                        adOld.setName(ad.getName());
                        adOld.setSize(ad.getSize());
                        adOld.setUrl(ad.getUrl());
                        adOld.setMaterialUrl(ad.getMaterialUrl());
                        adOld.setUpdateDate(new Date());
                        // 状态改成待审
                        adOld.setStatus(Constant.GENERAL_ID_ONE);
                        baseRepository.update(adOld);
                        objectNode.put("result", "success");
                    }
                    stringBuilder.append(ad.toString()).append(",");
                }
            }
            log("广告管理", "更新", stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
        } catch (Exception e) {
            e.printStackTrace();
        }
        objectNode.put("message", "");
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 根据广告位置和状态查询广告数
     * @param location
     * @param status
     * @return
     */
    public int getAvailableList(String location, int status) {
        Map<String, Object> params = new HashMap<String, Object>();
        // 查询包含待审以上的所有广告list
        params.put("status", status);
        params.put("location", location);
        String sql = " WHERE status > :status AND location = :location";
        return baseRepository.count(Ad.class, sql, params);
    }

    public boolean adSetPublish(Ad ad) {
        boolean status = false;
        if (ad.getStatus() == Constant.GENERAL_ID_THREE) { // 已审才可以发布
            try {
                if (1 == 1) { // // 调用发布静态化接口
                    ad.setStatus(Constant.GENERAL_ID_NINE);
                    ad.setUpdateDate(new Date());
                    baseRepository.update(ad);
                    log("广告管理","已发", ad.toString());
                    status = true;
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                return status;
            }
        } else {
            return status;
        }
    }

    /**
     * 给发布系统调用已审的广告数据
     * @return
     */
    public List<Ad> getAvailableList() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("status", Constant.GENERAL_ID_THREE);
        String sql = " WHERE status > :status";
        return baseRepository.list(Ad.class, sql, params);
    }

    public ObjectNode getlocationDataList() throws IOException {
        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode objectNode = objectMapper.createObjectNode();
        Iterator<Map.Entry<String, String>> iterator = locationData.entrySet().iterator();
        while(iterator.hasNext()) {
            Map.Entry entry = iterator.next();
            ObjectNode jsonNode = objectMapper.createObjectNode();
            jsonNode.put("id", (String) entry.getKey());
            jsonNode.put("name", (String) entry.getValue());
            arrayNode.add(jsonNode);
        }
        objectNode.put("result", "success");
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    // 基础数据
    static Map<String, String> locationData = new LinkedHashMap<String, String>() {{
        put("hmlzs.home.banner1.left", "hmlzs.home.banner1.left");
        put("hmlzs.home.banner1.right", "hmlzs.home.banner1.right");
    }};
}
