Ext.define('Admin.view.content.news.News', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-news', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.content.news.NewsController',
        'Admin.view.content.news.NewsSearchPanel',
        'Admin.view.content.news.NewsMainGrid'
    ],

    uses: [
        'Admin.view.content.news.NewsMainForm',

        'Admin.view.content.headline.HeadLineWindow',
        'Admin.view.content.headline.text.TextMainGrid',
        'Admin.view.content.headline.picture.PictureMainForm',
        'Admin.view.content.headline.picture.PictureMainGrid'
    ],

    controller: 'content-news',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'north',
                    xtype: 'content-news-sp'
                },
                {
                    region: 'center',
                    xtype: 'content-news-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
