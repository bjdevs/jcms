package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/5/27.
 */
public class Serial {

    private long id;
    private String name;
    private String depict;
    private int tId;
    private String url;
    private int status;
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

    public String getDepict() {
        return depict;
    }

    public void setDepict(String depict) {
        this.depict = depict;
    }

    public int gettId() {
        return tId;
    }

    public void settId(int tId) {
        this.tId = tId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public String toString() {
        return "Serial{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", depict='" + depict + '\'' +
                ", tId=" + tId +
                ", url='" + url + '\'' +
                ", status=" + status +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                '}';
    }
}
