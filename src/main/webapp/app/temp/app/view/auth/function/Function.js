Ext.define('Admin.view.auth.function.Function', {
    extend: 'Ext.panel.Panel',
    xtype: 'auth-function', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.auth.function.FunctionController',
        'Admin.view.auth.function.FunctionMainGrid'
    ],

    uses: [
        'Admin.view.auth.function.FunctionMainForm'
    ],

    controller: 'auth-function',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'auth-function-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
