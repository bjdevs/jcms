Ext.define('Admin.view.media.Media', {
    extend: 'Ext.panel.Panel',
    xtype: 'media', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.media.MediaController',
        'Admin.view.media.MediaGrid'
    ],

    uses: [
        'Admin.view.media.MediaForm',
        'Admin.view.media.MediaUpdateForm'
    ],

    controller: 'media',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    xtype: 'media-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
