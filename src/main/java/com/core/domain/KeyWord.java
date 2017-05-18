package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/5/8.
 */
public class KeyWord {

    private long id;
    private String name;
    private String depict;
    private int count;
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

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
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
        return "KeyWord{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", depict='" + depict + '\'' +
                ", count=" + count +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                '}';
    }
}
