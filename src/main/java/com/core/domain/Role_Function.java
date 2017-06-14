package com.core.domain;

/**
 * Created by sun on 2017/5/25.
 */
import com.core.repository.annotation.*;

@Table
public class Role_Function {
    private long id;
    private int rId;
    private int fId;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getrId() {
        return rId;
    }

    public void setrId(int rId) {
        this.rId = rId;
    }

    public int getfId() {
        return fId;
    }

    public void setfId(int fId) {
        this.fId = fId;
    }
}
