Ext.define('Admin.view.content.index.embed.Focus', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-index-embed-focus',

    requires: [
        'Admin.view.content.index.embed.FocusGrid',
        'Admin.view.content.index.embed.FocusController'
    ],

    controller: 'content-index-embed-focus',
    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'content-headline-focus-mgrid'
                }
            ]
        });

        me.callParent();
    }
});