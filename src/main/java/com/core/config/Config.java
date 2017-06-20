package com.core.config;


public class Config {
    //private String platform;
    private String database;

    private String dbName;
    private String projectName;

    private String domain;
    private String preViewDomain;
    private String listDomain;
    private String listParam;

    private String listSerialParam;

    // 静态资源链接前缀
    private String staticResourceURLPrefix;

    private long dbIdBuffSize;

    private long articleIdAddend;

    private String templateDir;
    private String previewDir;

    // 文章地址
    private String articleDir;

    // 套红
    private String preTag;
    private String postTag;

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getListDomain() {
        return listDomain;
    }

    public void setListDomain(String listDomain) {
        this.listDomain = listDomain;
    }

    public String getListParam() {
        return listParam;
    }

    public void setListParam(String listParam) {
        this.listParam = listParam;
    }

    public String getStaticResourceURLPrefix() {
        return staticResourceURLPrefix;
    }

    public void setStaticResourceURLPrefix(String staticResourceURLPrefix) {
        this.staticResourceURLPrefix = staticResourceURLPrefix;
    }

    public long getDbIdBuffSize() {
        return dbIdBuffSize;
    }

    public void setDbIdBuffSize(long dbIdBuffSize) {
        this.dbIdBuffSize = dbIdBuffSize;
    }

    public long getArticleIdAddend() {
        return articleIdAddend;
    }

    public void setArticleIdAddend(long articleIdAddend) {
        this.articleIdAddend = articleIdAddend;
    }

    public String getTemplateDir() {
        return templateDir;
    }

    public void setTemplateDir(String templateDir) {
        this.templateDir = templateDir;
    }

    public String getPreviewDir() {
        return previewDir;
    }

    public void setPreviewDir(String previewDir) {
        this.previewDir = previewDir;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getArticleDir() {
        return articleDir;
    }

    public void setArticleDir(String articleDir) {
        this.articleDir = articleDir;
    }

    public String getPreTag() {
        return preTag;
    }

    public void setPreTag(String preTag) {
        this.preTag = preTag;
    }

    public String getPostTag() {
        return postTag;
    }

    public void setPostTag(String postTag) {
        this.postTag = postTag;
    }

    public String getListSerialParam() {
        return listSerialParam;
    }

    public void setListSerialParam(String listSerialParam) {
        this.listSerialParam = listSerialParam;
    }

    public String getPreViewDomain() {
        return preViewDomain;
    }

    public void setPreViewDomain(String preViewDomain) {
        this.preViewDomain = preViewDomain;
    }
}
