package com.core.service;

import com.core.domain.Media;
import com.core.domain.User;
import com.core.repository.sqlBuilder.Page;
import com.core.util.Constant;
import com.core.util.ProjectUtil;
import com.core.util.QiniuAuthUtil;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Response;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by sun on 2017/5/2.
 */
@Service
public class MediaService extends BaseService {

    @Autowired
    private QiniuAuthUtil qiniuAuthUtil;

    @Autowired
    private UserService userService;

    public String get(String a) {
        return qiniuAuthUtil.getAccessDomain();
    }

    /**
     * 根据媒体类型 获取数据
<<<<<<< HEAD
<<<<<<< HEAD
=======
     *
>>>>>>> upstream/master
=======
     *
>>>>>>> origin/master
     * @param
     * @return
     */
    public ObjectNode getList(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();

        String title = request.getParameter("title");
        String startDate = request.getParameter("startdate");
        String endDate = request.getParameter("enddate");
        int type = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("type")) ? request.getParameter("type") : "0");
        int pageSize = Integer.parseInt(
                !StringUtils.isBlank(request.getParameter("pageSize")) ? request.getParameter("pageSize") : Constant.PAGE_SIZE + "");
        int pageNum = Integer.valueOf(
                !StringUtils.isBlank(request.getParameter("page")) ? request.getParameter("page") : 1 + "");
        String sql = "";
        sql = " WHERE 1 = 1";
        Map<String, Object> params = new HashMap<String, Object>();
        if (!StringUtils.isBlank(title)) {
            params.put("title", title);
            sql += " AND title = :title";
        }
        if (type > 0) {
            params.put("type", type);
            sql += " AND type = :type";
        }
        if (!StringUtils.isBlank(startDate) && !StringUtils.isBlank(endDate)
                && startDate.length() > 5 && endDate.length() > 5) {
            params.put("createDate", startDate);
            params.put("endDate", endDate.replace("00:00:00", "23:59:59"));
            sql += " AND createDate > :createDate AND createDate < :endDate";
        }

        Page<Media> page = this.getPage(Media.class, sql, params, pageSize, pageNum);
        List<Media> list = page.getResultList();
        ArrayNode arrayNode = objectMapper.createArrayNode();

        for (Media m : list) {
            ObjectNode jsonNode = objectMapper.valueToTree(m);
            jsonNode.put("url", m.getRealUrl());
            jsonNode.put("preview", "<a href=\"" + m.getRealUrl() + "\" target=\"_blank\">查看</a>");
            jsonNode.put("user", find(User.class, m.getuId()).getAccount());
            arrayNode.add(jsonNode);
        }

        objectNode.put("result", "success");
        objectNode.put("totalData", page.getTotalData());
        objectNode.put("data", arrayNode);
        objectNode.put("success", true);
        return objectNode;
    }

    /**
     * 更新
     *
     * @param request
     * @return
     */
    public ObjectNode updateMedia(HttpServletRequest request) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("result", "failed");
        objectNode.put("message", "");
        objectNode.put("success", true);
        try {
            String data = request.getParameter("data");
            StringBuilder stringBuilder = new StringBuilder("广告ID:[");
            Media media = null;
            Media mediaOld = null;
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(data);
            for (JsonNode jsonNode : root) {
                media = new Media();
                // 考虑转成它
                //mapper.readValue()
                media.setId(jsonNode.get("id").asLong());
                media.setTitle(jsonNode.get("title").asText());
                //media.setUrl(jsonNode.get("url").asText());
                media.setType((byte) jsonNode.get("type").asInt());
                //media.setcId((short) jsonNode.get("cId").asInt());
                media.setStatus((byte) jsonNode.get("status").asInt());
                //media.setuId((short) (jsonNode.get("uId").asInt()));
                if (media.getId() > 0) {
                    mediaOld = find(Media.class, media.getId());
                    if (mediaOld != null && mediaOld.getId() > 0) {
                        //mediaOld.setUrl(media.getUrl());
                        mediaOld.setTitle(media.getTitle());
                        //mediaOld.setuId(media.getuId());
                        //mediaOld.setcId(media.getcId());
                        mediaOld.setType(media.getType());
                        mediaOld.setStatus(media.getStatus());
                        baseRepository.update(mediaOld);
                        objectNode.put("result", "success");
                        stringBuilder.append(mediaOld.getId()).append(",");
                    }
                }
                log("广告管理（更新）", stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return objectNode;
    }

    /**
     * @param request
     * @param type    0->废弃,1->启用,2->删除
     * @return
     */
    public ObjectNode multifunctionMediaAH(HttpServletRequest request, int type) {
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("result", "failed");
        objectNode.put("message", "");
        objectNode.put("success", true);
        try {
            String[] ids = request.getParameterValues("ids");
            StringBuilder stringBuilder = new StringBuilder("广告ID:[");
            String typeStr = "";
            Media media = null;
            for (String num : ids) {
                long id = Long.parseLong(num);
                media = new Media();
                media.setId(id);
                media = baseRepository.find(Media.class, media.getId());
                if (media != null && media.getId() > 0) {
                    if (type == 0) { // 废弃
                        media.setStatus(Constant.GENERAL_ID_ZERO);
                        typeStr = "废弃";
                        baseRepository.update(media);
                    }
                    if (type == 1) { // 启用
                        media.setStatus(Constant.GENERAL_ID_ONE);
                        typeStr = "启用";
                        baseRepository.update(media);
                    }
                    if (type == 2) { // 删除
                        qiniuAuthUtil.deleteFile(media.getRealUrl().split(qiniuAuthUtil.accessDomain)[1]);
                        typeStr = "删除";
                        baseRepository.delete(Media.class, media.getId());
                    }
                    objectNode.put("result", "success");
                    stringBuilder.append(media.getId()).append(",");
                }
            }
            log("媒体管理（"+typeStr+"）", stringBuilder.toString().substring(0,stringBuilder.length()-1) + "]");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return objectNode;
    }

    public String createMedia(MultipartHttpServletRequest msr) throws Exception {
        Iterator<String> fileNames = msr.getFileNames();
        ObjectNode objectNode = objectMapper.createObjectNode();

        String result = "failed";
        String message = "";
        objectNode.put("success", true);
        // kindEditor : error=0 => upload success
        int error = 0;

        String id = msr.getParameter("id");
        String title = msr.getParameter("title");

        if (!StringUtils.isBlank(id) && !StringUtils.isBlank(title)) {
            Media media = new Media();
            media.setId(Integer.parseInt(id));
            media.setTitle(title);
            if (media.getId() > 0) {
                Media mediaOld = find(Media.class, media.getId());
                if (mediaOld != null && mediaOld.getId() > 0) {
                    mediaOld.setTitle(media.getTitle());
                    try {
                        baseRepository.update(mediaOld);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    result = "success";
                    log("媒体管理（更新）", mediaOld.toString());
                }
            }
        } else {
            // 新增
            User userInfo = (User) request.getAttribute("user");
            // 媒体类型 图片 / 音频 / 文档
            byte mediaType = Byte.valueOf(msr.getParameter("type"));
            // 命名规则 系统默认 / 原始名称
            byte ruleType = Byte.valueOf(msr.getParameter("rule"));

            try {
                MultipartFile msrFile = msr.getFile(fileNames.next());
                long msrFileSize = msrFile.getSize();
                String fileName = msrFile.getOriginalFilename().toLowerCase();
                String[] fileNameArray = fileName.split("\\.");
                //String title = msr.getParameter("title");
                boolean isImage = true;
                String path = "";
                // 检查上传文件类型
                switch (mediaType) {
                    case Constant.MEDIA_TYPE_PICTURE:
                        path = "pic/";
                        if (!fileName.matches(Constant.IMG_FILTER)) {
                            message = Constant.IMG_FILTER_MSG;
                            isImage = false;
                            error = 1;
                        }
                        if (msrFileSize > Constant.UPLOAD_PICTURE_MAX_SIZE) {
                            message = "上传图片超过最大上限 10MB，请重新上传";
                            isImage = false;
                            error = 1;
                        }
                        break;
                    case Constant.MEDIA_TYPE_AUDIO:
                        path = "audio/";
                        if (!fileName.matches(Constant.AUDIO_FILTER)) {
                            message = Constant.AUDIO_FILTER_MSG;
                            isImage = false;
                            error = 1;
                        }
                        if (msrFileSize > Constant.UPLOAD_AUDIO_MAX_SIZE) {
                            message = "上传音频超过最大上限 30MB，请重新上传";
                            isImage = false;
                            error = 1;
                        }
                        break;
                    case Constant.MEDIA_TYPE_DOCUMENT:
                        path = "doc/";
                        if (!fileName.matches(Constant.DOCUMENT_FILTER)) {
                            message = Constant.DOCUMENT_FILTER_MSG;
                            isImage = false;
                            error = 1;
                        }
                        if (msrFileSize > Constant.UPLOAD_DOCUMENT_MAX_SIZE) {
                            message = "上传文档超过最大上限 20MB，请重新上传";
                            isImage = false;
                            error = 1;
                        }
                        break;
                    default:
                        message = Constant.NO_SUPPORT_TYPE;
                        isImage = false;
                        error = 1;
                }
                // 检查上传文件名是否合法
                if (ruleType == 1) {
                    if (!fileName.matches(Constant.FILERULE_FILTER)) {
                        message = Constant.FILERULE_FILTER_MSG;
                        isImage = false;
                        error = 1;
                    }
                }
                if (fileNameArray.length != 2) {
                    message = "上传文件丢失扩展名";
                    isImage = false;
                    error = 1;
                }
                if (isImage) {
                    // 七牛
                    String realFileName = ProjectUtil.getFileName(fileName);
                    // 上传到七牛云
                    if (ruleType == 1) { // 使用原名
                        realFileName = fileName;
                    }
                    // 上传图片路径 pic
                    // 上传音频 audio
                    // 上传文档 doc
                    upload(mediaType, msrFile.getBytes(), path + realFileName, ruleType);
                    Media media = new Media();
                    media.setTitle(title);
                    realFileName = qiniuAuthUtil.getAccessDomain() + path + realFileName;
                    if (ruleType == 1) { // 使用原名
                        // 增加时间戳
                        realFileName = realFileName + "?v=" + System.currentTimeMillis();
                    }
                    media.setUrl(realFileName);
                    media.setType(mediaType);
                    media.setCreateDate(new Date());
                    media.setStatus(Constant.GENERAL_ID_ONE);
                    media.setuId((byte) userInfo.getId());
                    media.setId(baseRepository.create(media));
                    result = "success";
                    log("媒体管理（新增）", media.toString());
                    result = "success";
                    objectNode.put("url", media.getRealUrl());
                    result = "success";
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        objectNode.put("result", result);
        objectNode.put("message", message);
        objectNode.put("success", true);
        objectNode.put("error", error);
        return objectNode.toString();
    }


    /**
     * @param bytes      MultipartFile
     * @param key        文件名
     * @param uploadType 0-系统生成不允许覆盖,1-原始名称上传允许覆盖
     * @return
     * @throws QiniuException
     */
    private int upload(byte mediaType, byte[] bytes, String key, byte uploadType) throws QiniuException {
        Response response = qiniuAuthUtil.getUploadManager().put(
                bytes,
                key,
                uploadType == 0 ? qiniuAuthUtil.getUpToken0(mediaType) : qiniuAuthUtil.getUpToken1(mediaType, key));
        return response.statusCode;
    }
}
