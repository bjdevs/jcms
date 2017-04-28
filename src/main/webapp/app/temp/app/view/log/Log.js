Ext.define('Admin.view.log.Log', {
    extend: 'Ext.panel.Panel',
    xtype: 'log',

    requires: [
        'Admin.view.log.LogController',
        //'Admin.view.log.LogSearchPanel',
        'Admin.view.log.LogMainGrid'
    ],

    controller: 'log',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
               /* {
                    region: 'north',
                    xtype: 'log-sp'
                },*/
                {
                    region: 'center',
                    xtype: 'log-mgrid'
                }
            ]
        });

        me.callParent();


    }
});