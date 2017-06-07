Ext.define('Admin.view.content.recycle.Recycle', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-recycle', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.content.recycle.RecycleController',
        'Admin.view.content.recycle.RecycleSearchPanel',
        'Admin.view.content.recycle.RecycleMainGrid'
    ],

    controller: 'content-recycle',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'north',
                    xtype: 'content-recycle-sp'
                },
                {
                    region: 'center',
                    xtype: 'content-recycle-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
