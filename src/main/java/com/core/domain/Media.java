package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/4/28.
 */
public class Media {

    private long id;
    private int uId;
    private String title;
    private String depict;

    // 0 9
    private int type;
    private String url;
    private int cId;
    private int status;
    private Date createDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getuId() {
        return uId;
    }

    public void setuId(int uId) {
        this.uId = uId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepict() {
        return depict;
    }

    public void setDepict(String depict) {
        this.depict = depict;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getcId() {
        return cId;
    }

    public void setcId(int cId) {
        this.cId = cId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "Media{" +
                "id=" + id +
                ", uId=" + uId +
                ", title='" + title + '\'' +
                ", depict='" + depict + '\'' +
                ", type=" + type +
                ", url='" + url + '\'' +
                ", cId=" + cId +
                ", status=" + status +
                ", createDate=" + createDate +
                '}';
    }
}
