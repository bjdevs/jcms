package com.core.util;

/**
 * Created by sun on 2017/4/18.
 */
public class Constant {
    // 默认编码
    public static final String ENCODE_UTF8 = "UTF-8";

    public static final String ARTICE_CONTENT_SPLICE = "@";

    public static final String WINDOW_TITLE_SUFFIX = "_黄梅老祖寺";

    public static final int ARTICLE_CONTENT_LENGTH = 255;

    public static final int PAGE_SIZE = 25;


    /**
     * 适用
     * 文章 0-初稿 / 1-已签 /  5-返工  / 9-已发 /  10+-已删
     * 头条 0-未发 / 9-已发
     */
    public static final int ARTICLE_ID_MINUS = -1;
    public static final int ARTICLE_ID_ZERO = 0;
    public static final int ARTICLE_ID_ONE = 1;
    public static final int ARTICLE_ID_FIVE = 5;
    public static final int ARTICLE_ID_NINE = 9;
    public static final int ARTICLE_ID_TEN = 10;


    /**
     * 文章：导航，副导航
     */
    // 主导航
    public static final int NAV_ID_MAIN = 1;
    // 次导航
    public static final int NAV_ID_DEPUTY = 2;


    /**
     * 分类 Category
     */
    // navBanner
    public static final int CATEGORY_ID_NAVBANNER = 1;
    // 新闻法讯
    public static final int CATEGORY_ID_NEWS = 2;
    // 生活禅
    public static final int CATEGORY_ID_LIFE = 3;
    // 紫云佛国
    public static final int CATEGORY_ID_ZIYUNFOGUO = 4;
    // 禅医养生
    public static final int CATEGORY_ID_MEDICAL = 5;
    // 佛教常识
    public static final int CATEGORY_ID_KNOWLEDGE = 6;
    // 藏经阁
    public static final int CATEGORY_ID_DEPOSITORY = 7;
    // 水墨禅韵
    public static final int CATEGORY_ID_WATERZEN = 8;
    // 紫云法务
    public static final int CATEGORY_ID_LAW = 9;

    // 广种福田
    public static final int CATEGORY_ID_FUTIAN = 10;
    // 联系我们
    public static final int CATEGORY_ID_CONTACT = 11;
    // 活动通知
    public static final int CATEGORY_ID_NOTICE = 12;

    // 默认分类
    public static final int CATEGORY_ID_DEFAULT = 13;

    // 首屏焦点图
    public static final int CATEGORY_ID_FOCUS = 0;

    /**
     * 适用
     * 登录、分类、模板、头条套红、媒体类型
     */
    public static final byte GENERAL_ID_ZERO = 0;
    // 适用：媒体类型-图片 ...
    public static final byte GENERAL_ID_ONE = 1;
    // 适用：媒体类型-音频 ...
    public static final byte GENERAL_ID_TWO = 2;
    // 适用：媒体类型-文档 ...
    public static final byte GENERAL_ID_THREE = 3;
    // 使用：发布状态 ...
    public static final byte GENERAL_ID_NINE = 9;

    public static final String ARTICLE_LIST_PAGE_NAME = "articleList";
    public static final String PHOTO_LIST_PAGE_NAME = "photoList";
    public static final String STATIC_RESOURCE_URL_PREFIX = "resURLPrefix";
    public static final String LIST_PAGE_URL_PREFIX = "listURLPrefix";

    public static final String AD_LOCATION_LEFT = "hmlzs.home.banner1.left";
    public static final String AD_LOCATION_RIGHT = "hmlzs.home.banner1.right";

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
     * 权限
     */
    public static final int AUTH_ACCOUNT = 101;
    public static final int AUTH_USER = 202;

    /**
     *  lucene
     */
    // 搜索页标题长度
    public static final int LUCENE_TITLE_FRAGMENT_LEN = 30;
    // 搜索页内容长度
    public static final int LUCENE_CONTENT_FRAGMENT_LEN = 100;
    // 搜索页每页数量
    public static final int LUCENE_SEARCH_PAGESIZE = 10;
}