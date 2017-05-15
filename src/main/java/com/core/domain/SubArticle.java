package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/4/25.
 * 文章拼接
 */
public class SubArticle {
    private long id;
    private int seq;
    private int aId;
    private String content;
    private Date createDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public int getaId() {
        return aId;
    }

    public void setaId(int aId) {
        this.aId = aId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "SubArticle{" +
                "id=" + id +
                ", seq=" + seq +
                ", aId=" + aId +
                ", content='" + content + '\'' +
                ", createDate=" + createDate +
                '}';
    }
}
