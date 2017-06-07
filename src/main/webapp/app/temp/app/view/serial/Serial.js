Ext.define('Admin.view.serial.Serial', {
    extend: 'Ext.panel.Panel',
    xtype: 'serial',

    requires: [
        'Admin.view.serial.SerialGrid',
        'Admin.view.serial.SerialController',
        'Admin.view.serial.SerialForm'
    ],

    controller: 'serial',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {

            items: [
                {
                    region: 'center',
                    xtype: 'serial-mgrid'
                }
            ]

        });


        me.callParent();
    }


});