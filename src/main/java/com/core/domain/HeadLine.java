package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/4/28.
 * 头条
 */
public class HeadLine {

    private long id;
    private int uId;
    private String name;
    private int different;
    private int status;
    private int redStatus;
    private int aId;
    private int mId;
    private int cId;

    private Date createDate;
    private Date updateDate;

    private int cateOrderBy;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDifferent() {
        return different;
    }

    public void setDifferent(int different) {
        this.different = different;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getRedStatus() {
        return redStatus;
    }

    public void setRedStatus(int redStatus) {
        this.redStatus = redStatus;
    }

    public int getaId() {
        return aId;
    }

    public void setaId(int aId) {
        this.aId = aId;
    }

    public int getmId() {
        return mId;
    }

    public void setmId(int mId) {
        this.mId = mId;
    }

    public int getcId() {
        return cId;
    }

    public void setcId(int cId) {
        this.cId = cId;
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

    public int getCateOrderBy() {
        return cateOrderBy;
    }

    public void setCateOrderBy(int cateOrderBy) {
        this.cateOrderBy = cateOrderBy;
    }

    @Override
    public String toString() {
        return "HeadLine{" +
                "id=" + id +
                ", uId=" + uId +
                ", name='" + name + '\'' +
                ", different=" + different +
                ", status=" + status +
                ", redStatus=" + redStatus +
                ", aId=" + aId +
                ", mId=" + mId +
                ", cId=" + cId +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                ", cateOrderBy=" + cateOrderBy +
                '}';
    }
}
