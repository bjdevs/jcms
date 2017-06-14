Ext.define('Admin.view.content.Content', {
    extend: 'Ext.panel.Panel',
    xtype: 'content', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.content.ContentController',
        'Admin.view.content.ContentSearchPanel',
        'Admin.view.content.ContentMainGrid'
    ],

    uses: [
        'Admin.view.content.ContentMainForm',

        'Admin.view.content.headline.HeadLineWindow',
        'Admin.view.content.headline.text.TextMainGrid',
        'Admin.view.content.headline.picture.PictureMainGrid',
        'Admin.view.content.headline.picture.PictureMainForm',
        'Admin.view.content.headline.text.TextMainForm',
        'Admin.view.content.ArticleUpdatePanel'
    ],

    controller: 'content',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'north',
                    xtype: 'content-sp'
                },
                {
                    region: 'center',
                    xtype: 'content-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
