package com.core.domain;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.Date;

/**
 * Created by sun on 2017/5/2.
 */
public class Media {

    private long id;
    private short uId;
    private String title;
    private byte type;
    private String url;
    private short cId;
    private byte status;
    private Date createDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public short getuId() {
        return uId;
    }

    public void setuId(short uId) {
        this.uId = uId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public byte getType() {
        return type;
    }

    public void setType(byte type) {
        this.type = type;
    }

    /**
     * 首页大焦点图          630x420
     * 首页焦点图右1         102x68
     * 首页栏目图片1         240x160
     * 首页栏目图片2         144x96
     * 水墨禅韵头条          279x186
     * 首页通栏左侧1         912x100
     * 首页通栏右侧1         240x100
     */

    @JsonIgnore
    public String getPic_630x420() {
        return getUrl("630x420");
    }

    @JsonIgnore
    public String getPic_102x68() {
        return getUrl("102x68");
    }

    @JsonIgnore
    public String getPic_240x160() {
        return getUrl("240x160");
    }

    @JsonIgnore
    public String getPic_144x96() {
        return getUrl("144x96");
    }

    @JsonIgnore
    public String getPic_279x186() {
        return getUrl("279x186");
    }

    @JsonIgnore
    public String getPic_912x100() {
        return getUrl("912x100");
    }

    @JsonIgnore
    public String getPic_240x100() {
        return getUrl("240x100");
    }

    // 获取音频 / 文档类型使用此方法
    @JsonIgnore
    public String getRealUrl() {
        return getUrl("");
    }

    /**
     *
     * @param rule 允许为空
     * @return
     */
    @JsonIgnore
    public String getUrl(String rule) {
        if (url.split("\\?").length != 2) {
            return  url + (!StringUtils.isBlank(rule) ? "-" + rule : "");
        } else {
            String[] urls = url.split("\\?");
            return urls[0] + (!StringUtils.isBlank(rule) ? "-" + rule : "") + "?" + urls[1];
        }
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public short getcId() {
        return cId;
    }

    public void setcId(short cId) {
        this.cId = cId;
    }

    public byte getStatus() {
        return status;
    }

    public void setStatus(byte status) {
        this.status = status;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
