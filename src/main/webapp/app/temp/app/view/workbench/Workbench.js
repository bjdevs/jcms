Ext.define('Admin.view.workbench.Workbench', {
    extend: 'Ext.panel.Panel',
    xtype: 'workbench', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.workbench.WorkbenchController',
        'Admin.view.workbench.WorkbenchSearchPanel',
        'Admin.view.workbench.WorkbenchMainGrid'
    ],


    controller: 'workbench',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            items: [
                {
                    region: 'north',
                    xtype: 'workbench-sp'
                },
                {
                    region: 'center',
                    xtype: 'workbench-mgrid'
                },
                {
                    region: 'south',
                    xtype: 'homepage',
                    // height: '40%'
                }
            ]
        });

        me.callParent();


    }

});
