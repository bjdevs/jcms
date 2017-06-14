Ext.define('Admin.view.content.index.embed.Futian', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-index-embed-futian',

    requires: [
        'Admin.view.content.index.embed.FutianController',
        'Admin.view.content.index.embed.FutianGrid',
        'Admin.view.content.index.embed.FutianForm'
    ],

    controller: 'content-index-embed-futian',
    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    region:'north',
                    xtype: 'content-index-embed-futian-mform'
                },
                {
                    region:'center',
                    xtype: 'content-index-embed-futian-mgrid'
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '保存',
                    iconCls: 'x-fa fa-floppy-o',
                    action: 'edit'
                },
                {
                    xtype: 'button',
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    action: 'release'
                },
                '-',
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                },
                '->',
                {
                    xtype: 'label',
                    html: '在需要修改的数据上面单击并输入新的数据点击保存即可。',
                    style: {
                        'color': 'crimson'
                    }
                }
            ]
        });

        me.callParent();
    }
});