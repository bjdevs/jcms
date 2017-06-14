package com.core.domain;

/**
 * Created by sun on 2017/5/25.
 */
public class Role {
    private long id;
    private String name;
    private String depict;

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

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", depict='" + depict + '\'' +
                '}';
    }
}
