Ext.define('Admin.view.auth.role.Role', {
    extend: 'Ext.panel.Panel',
    xtype: 'auth-role', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.auth.role.RoleController',
        'Admin.view.auth.role.RoleMainGrid'
    ],

    uses: [
        'Admin.view.auth.role.RoleMainForm'
    ],

    controller: 'auth-role',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'auth-role-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
