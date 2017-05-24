Ext.define('Admin.view.publish.Publish', {
    extend: 'Ext.panel.Panel',
    xtype: 'publish',

    requires: [
        'Admin.view.publish.PublishGrid',
        'Admin.view.publish.publishController'
    ],

    controller: 'publish',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {

            items: [
                {
                    region: 'center',
                    xtype: 'publish-mgrid'
                }
            ]

        });


        me.callParent();
    }


});