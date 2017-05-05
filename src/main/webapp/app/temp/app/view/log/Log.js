Ext.define('Admin.view.log.Log', {
    extend: 'Ext.panel.Panel',
    xtype: 'log', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.log.LogController',
        'Admin.view.log.LogSearchPanel',
        'Admin.view.log.LogMainGrid'
    ],


    controller: 'log',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            items: [
                {
                    region: 'north',
                    xtype: 'log-sp'
                },
                {
                    region: 'center',
                    xtype: 'log-mgrid'
                }

            ]
        });

        me.callParent();


    }

});
