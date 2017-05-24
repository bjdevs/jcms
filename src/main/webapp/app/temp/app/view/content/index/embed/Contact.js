Ext.define('Admin.view.content.index.embed.Contact', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-index-embed-contact',

    requires: [
        'Admin.view.content.index.embed.ContactGrid',
        'Admin.view.content.index.embed.ContactController'
    ],

    controller: 'content-index-embed-contact',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'content-index-embed-contact-mgrid'
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '保存',
                    iconCls: 'x-fa fa-pencil-square-o',
                    action: 'edit'
                },
                {
                    xtype: 'button',
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    action: 'release'
                },
                '-',
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                }
            ]
        });

        me.callParent();
    }


});