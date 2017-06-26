package com.core.domain;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Date;

/**
 * Created by yk on 2017/4/27.
 */
public class Ad {

    private long id;
    private String name;
    private String location;
    private int status;
    private String size;
    private String url;
    private String materialUrl;
    private int uId;
    private Date createDate;
    private Date updateDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getUrl() throws UnsupportedEncodingException {
        return URLDecoder.decode(url, "UTF-8");
    }

    public void setUrl(String url) throws UnsupportedEncodingException {
        this.url = URLEncoder.encode(url, "UTF-8");
    }

    public String getMaterialUrl() throws UnsupportedEncodingException {
        return URLDecoder.decode(materialUrl, "UTF-8");
    }

    public void setMaterialUrl(String materialUrl) throws UnsupportedEncodingException {
        this.materialUrl = URLEncoder.encode(materialUrl, "UTF-8");
    }

    public int getuId() {
        return uId;
    }

    public void setuId(int uId) {
        this.uId = uId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public String toString() {
        return "Ad{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", status=" + status +
                ", size='" + size + '\'' +
                ", url='" + url + '\'' +
                ", materialUrl='" + materialUrl + '\'' +
                ", uId=" + uId +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                '}';
    }
}
