Ext.define('Admin.view.log.update.Update', {
    extend: 'Ext.container.Container',
    xtype: 'updatelog',

    requires: [
        'Ext.ux.layout.ResponsiveColumn'

    ],
    layout: 'responsivecolumn',

    scrollable: 'y',

    initComponent: function () {
        var me = this;

        var store = Ext.create('Admin.store.UpdateLog'),
            logs = store.logs;

        Ext.apply(me, {
            items: logs
        });

        me.callParent();
    }
});