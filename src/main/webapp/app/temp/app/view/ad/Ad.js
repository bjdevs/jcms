Ext.define('Admin.view.ad.Ad', {
    extend: 'Ext.panel.Panel',
    xtype: 'ad', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.ad.AdController',
        'Admin.view.ad.AdGrid'
    ],

    uses: [
        'Admin.view.ad.AdForm'
    ],

    controller: 'ad',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'ad-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
