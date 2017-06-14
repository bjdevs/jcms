package com.core.domain;

/**
 * Created by sun on 2017/5/27.
 */
public class Auth_Role {
    private long id;
    private int uId;
    private int rId;

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

    public int getrId() {
        return rId;
    }

    public void setrId(int rId) {
        this.rId = rId;
    }

    @Override
    public String toString() {
        return "Auth_Role{" +
                "id=" + id +
                ", uId=" + uId +
                ", rId=" + rId +
                '}';
    }
}
