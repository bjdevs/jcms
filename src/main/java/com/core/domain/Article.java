package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/4/25.
 * 文章
 */
public class Article {
    private long id;
    private int uId;
    private String author;
    private String source;
    private String title;
    private String depict;
    private String url;
    private String content;
    private int sId;
    private int tId;
    private int hAId;
    private int hPId;
    private int cId;
    private int status;
    private Date createDate;
    private Date updateDate;
    private Date publishDate;
    private int orderBy;

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

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getsId() {
        return sId;
    }

    public void setsId(int sId) {
        this.sId = sId;
    }

    public int gettId() {
        return tId;
    }

    public void settId(int tId) {
        this.tId = tId;
    }

    public int gethAId() {
        return hAId;
    }

    public void sethAId(int hAId) {
        this.hAId = hAId;
    }

    public int gethPId() {
        return hPId;
    }

    public void sethPId(int hPId) {
        this.hPId = hPId;
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

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public int getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(int orderBy) {
        this.orderBy = orderBy;
    }

    @Override
    public String toString() {
        return "Article{" +
                "id=" + id +
                ", uId=" + uId +
                ", author='" + author + '\'' +
                ", source='" + source + '\'' +
                ", title='" + title + '\'' +
                ", depict='" + depict + '\'' +
                ", url='" + url + '\'' +
                ", content='" + content + '\'' +
                ", sId=" + sId +
                ", tId=" + tId +
                ", hAId=" + hAId +
                ", hPId=" + hPId +
                ", cId=" + cId +
                ", status=" + status +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                ", publishDate=" + publishDate +
                ", orderBy=" + orderBy +
                '}';
    }
}
