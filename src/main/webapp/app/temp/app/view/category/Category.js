Ext.define('Admin.view.category.Category', {
    extend: 'Ext.panel.Panel',
    xtype: 'category', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.category.CategoryController',
        'Admin.view.category.CategoryMainGrid'
    ],

    uses: [
        'Admin.view.category.CategoryMainForm'
    ],

    controller: 'category',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'category-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
