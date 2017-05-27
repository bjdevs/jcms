Ext.define('Admin.view.content.ArticleUpdatePanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'main-panel-article',
    layout: 'border',
    margin: 5,

    requires: [
        'Admin.view.content.ArticleUpdateModel',
        'Admin.view.content.ArticleUpdateHandlePanel'
    ],

    viewModel: 'main-panel-article',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {

            items: [
                {
                    region: 'center',
                    xtype: 'article-handle'
                }
            ]

        });

        me.callParent();
    }

});