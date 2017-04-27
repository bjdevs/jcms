Ext.define('Admin.view.template.Template', {
    extend: 'Ext.panel.Panel',
    xtype: 'template', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.template.TemplateController',
        'Admin.view.template.TemplateMainGrid'
    ],

    uses: [
    ],

    controller: 'template',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'template-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
