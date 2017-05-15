Ext.define('Admin.view.auth.acl.Acl', {
    extend: 'Ext.panel.Panel',
    xtype: 'auth-acl', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.auth.acl.AclController',
        'Admin.view.auth.acl.AclMainGrid'
    ],

    uses: [
        'Admin.view.auth.acl.AclMainForm'
    ],

    controller: 'auth-acl',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'auth-acl-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
