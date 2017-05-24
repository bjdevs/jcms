package com.core.util;

import com.qiniu.common.QiniuException;
import com.qiniu.common.Zone;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import com.qiniu.util.StringMap;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by sun
 */
public class QiniuAuthUtil {

    private Auth auth;

    private String bucket;

    public String accessDomain;

    @Autowired
    private UploadManager uploadManager;

    private static final int EXPIRES_TIME = 3600;

    public QiniuAuthUtil(String accessKey, String secretKey, String bucket, String accessDomain) {
        this.auth = Auth.create(accessKey, secretKey);
        this.bucket = bucket;
        this.accessDomain = accessDomain;
    }

    public Auth getAuth() {
        return auth;
    }

    public String getAccessDomain() {
        return accessDomain;
    }

    public UploadManager getUploadManager() {
        return uploadManager;
    }

    public void setUploadManager(UploadManager uploadManager) {
        this.uploadManager = uploadManager;
    }

    public String getUpToken0(byte mediaType) {
        return baseUploadToken(mediaType, "");
    }

    // 覆盖上传
    public String getUpToken1(byte mediaType, String key) {
        return baseUploadToken(mediaType, key);
    }

    public String baseUploadToken(byte mediaType, String key) {
        int maxSize = 0;
        switch (mediaType) {
            case Constant.MEDIA_TYPE_PICTURE://图片
                maxSize = Constant.UPLOAD_PICTURE_MAX_SIZE;
                break;
            case Constant.MEDIA_TYPE_AUDIO://音频
                maxSize = Constant.UPLOAD_AUDIO_MAX_SIZE;
                break;
            case Constant.MEDIA_TYPE_DOCUMENT://文档
                maxSize = Constant.UPLOAD_DOCUMENT_MAX_SIZE;
                break;
            default:
                maxSize = 0;//未知类型不允许上传
        }
        return auth.uploadToken(bucket, "".equals(key) ? null : key, EXPIRES_TIME, new StringMap().put("fsizeLimit", maxSize));
    }

    /*// 持久化240x160
    public String getUpToken3(String key) {
        String persistentOps = "imageView2/1/w/240/h/160/q/75|saveas/" + getBASE64(bucket + key);;
        return auth.uploadToken(bucket, null, EXPIRES_TIME, new StringMap()
                .putNotEmpty("persistentOps", persistentOps)
                .putNotEmpty("persistentNotifyUrl", ""));
    }

    public String getBASE64(String s) {
        if (s == null) return null;
        return (new sun.misc.BASE64Encoder()).encode(s.getBytes());
    }*/

    /*// 设置预处理、去除非限定的策略字段
    private String getUpToken3() {
        return auth.uploadToken(bucket, null, EXPIRES_TIME, new StringMap()
                .putNotEmpty("persistentOps", "").putNotEmpty("persistentNotifyUrl", ""), true);
    }*/

    /*// 设置预处理、去除非限定的策略字段
    private String getUpToken3() {
        return auth.uploadToken(bucket, null, EXPIRES_TIME, new StringMap()
                .putNotEmpty("persistentOps", "").putNotEmpty("persistentNotifyUrl", "")
                .putNotEmpty("persistentPipeline", ""), true);
    }*/

    // 删除文件
    public void deleteFile(String key) {
        Auth auth = this.auth;
        Configuration config = new Configuration(Zone.autoZone());
        BucketManager bucketMgr = new BucketManager(auth, config);
        try {
            bucketMgr.delete(bucket, key);
        } catch (QiniuException e) {
            e.printStackTrace();
        }
    }

    /**
     * 生成上传token
     *
     * @param bucket  空间名
     * @param key     key，可为 null
     * @param expires 有效时长，单位秒。默认3600s
     * @param policy  上传策略的其它参数，如 new StringMap().put("endUser", "uid").putNotEmpty("returnBody", "")。
     *                scope通过 bucket、key间接设置，deadline 通过 expires 间接设置
     * @param strict  是否去除非限定的策略字段，默认true
     * @return 生成的上传token
     */
    public String uploadToken(String bucket, String key, long expires, StringMap policy, boolean strict) {
        return "";
    }

    public class MyRet {
        public String key;
        public long size;
        public String type;
        public String hash;
        public int width;
        public int height;
    }

    private String getUpToken() {
        return auth.uploadToken("bucket", null, EXPIRES_TIME, new StringMap()
                .putNotEmpty("returnBody", "{\"key\": $(key), \"hash\": $(etag), \"width\": $(imageInfo.width), \"height\": $(imageInfo.height)}"));
    }
}