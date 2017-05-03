package com.core.util;

/**
 * Created by sun on 2017/4/18.
 */
public class Constant {
    // 默认编码
    public static final String ENCODE_UTF8 = "UTF-8";

    public static final String ARTICE_CONTENT_SPLICE = "@";

    public static final String WINDOW_TITLE_SUFFIX = "_黄梅老祖寺";

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

    /**
     * 适用
     * 文章 0-初稿 / 1-已签 /  5-返工  / 9-已发 /  10+-已删
     * 头条 0-未发 / 9-已发
     */
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
    // 紫云法务
    public static final int CATEGORY_ID_LAW = 8;
    // 水墨禅韵
    public static final int CATEGORY_ID_WATERZEN = 9;

    // 首屏焦点图
    public static final int CATEGORY_ID_FOCUS = 255;
    /*相减...*/

    // 广种福田
    public static final int CATEGORY_ID_FUTIAN = 10;
    // 联系我们
    public static final int CATEGORY_ID_CONTACT = 11;
    // 活动通知
    public static final int CATEGORY_ID_NOTICE = 12;

}
