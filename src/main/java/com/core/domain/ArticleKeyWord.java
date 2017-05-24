package com.core.domain;

/**
 * Created by yk on 2017/5/23.
 */
public class ArticleKeyWord {

    private long id;
    private int aId;
    private int kId;
    private int orderBy;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getaId() {
        return aId;
    }

    public void setaId(int aId) {
        this.aId = aId;
    }

    public int getkId() {
        return kId;
    }

    public void setkId(int kId) {
        this.kId = kId;
    }

    public int getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(int orderBy) {
        this.orderBy = orderBy;
    }

    @Override
    public String toString() {
        return "ArticleKeyWord{" +
                "id=" + id +
                ", aId=" + aId +
                ", kId=" + kId +
                ", orderBy=" + orderBy +
                '}';
    }
}
