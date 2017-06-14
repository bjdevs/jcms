package com.core.domain;

/**
 * Created by sun on 2017/5/26.
 */
public class Auth {
    private long id;
    private String name;
    private int uId;

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

    public int getuId() {
        return uId;
    }

    public void setuId(int uId) {
        this.uId = uId;
    }

    @Override
    public String toString() {
        return "Auth{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", uId=" + uId +
                '}';
    }
}
