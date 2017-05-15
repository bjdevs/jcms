package com.core.util;

/**
 * Created by sun on 2017/4/18.
 */
public class Constant {
    // 默认编码
    public static final String ENCODE_UTF8 = "UTF-8";

    public static final String WINDOW_TITLE_SUFFIX = "_黄梅老祖寺";

    public static final int PAGE_SIZE = 25;

    /**
     * 适用
     * 登录、分类、模板、头条套红、媒体状态
     */
    public static final byte GENERAL_ID_ZERO = 0;
    // 适用：媒体类型-图片 ...
    public static final byte GENERAL_ID_ONE = 1;
    // 适用：媒体类型-音频 ...
    public static final byte GENERAL_ID_TWO = 2;
    // 适用：媒体类型-文档 ...
    public static final byte GENERAL_ID_THREE = 3;

    /**
     * 适用
     * 媒体 媒体类型 1-图片 / 2-音频 / 3-文档
     */
    public static final int MEDIA_TYPE_PICTURE = 1;
    public static final int MEDIA_TYPE_AUDIO = 2;
    public static final int MEDIA_TYPE_DOCUMENT = 3;

    public static final String IMG_FILTER = "^.+\\.(jpg|jpeg|gif|png|bmp)$";
    public static final String IMG_FILTER_MSG = "上传失败: 不支持的图片类型，请上传jpg|jpeg|gif|png|bmp格式的图片";

    public static final String AUDIO_FILTER = "^.+\\.(mp3|wma)$";
    public static final String AUDIO_FILTER_MSG = "上传失败: 不支持的音频类型，请上传mp3|wma格式的音频文件";

    public static final String DOCUMENT_FILTER = "^.+\\.(txt|pdf|doc|docx|xls|xlsx)$";
    public static final String DOCUMENT_FILTER_MSG = "上传失败: 不支持的音频类型，请上传txt|pdf|doc|docx|xls|xlsx格式的音频文件";

    public static final String NO_SUPPORT_TYPE = "不支持的上传类型!";
    public static final String UPLOAD_ERROR = "出错了，请过2分钟后再上传 :(";

    public static final String FILERULE_FILTER = "^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9]+$";
    public static final String FILERULE_FILTER_MSG = "非法文件名，原始名称只能是半角状态下的字母、数字、下划线\"_\"、连接符\"-\"";

    // 1024 * 1024 * 10 图片 10MB
    public static final int UPLOAD_PICTURE_MAX_SIZE = 10485760;

    // 1024 * 1024 * 30 音频 30MB
    public static final int UPLOAD_AUDIO_MAX_SIZE = 31365120;

    // 1024 * 1024 * 20 文档 20MB
    public static final int UPLOAD_DOCUMENT_MAX_SIZE = 20971520;

    /**
     * 适用
     * 文章 0-初稿 / 1-已签 /  5-返工  / 9-已发 /  10+-已删
     * 头条 0-未发 / 9-已发
     *
     */

}