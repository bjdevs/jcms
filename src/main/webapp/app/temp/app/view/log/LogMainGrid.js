Ext.define('Admin.view.log.LogMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'log-mgrid',

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                remoteFilter:true,
                proxy: {
                    type: 'ajax',
                    url: '/cn/admin/logList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'totalData'
                    },
                    extraParams: {
                        pageSize: pageSize
                    }
                },
                autoLoad: true
            }),
            columns: [
                { text: 'ID', dataIndex: 'id', width: 80 },
                { text: '模块', dataIndex: 'name', width: 150 },
                { text: '动作', dataIndex: 'action', width: 100 },
                { text: '内容', dataIndex: 'content', flex: 1,renderer: me.renderer},
                { text: 'IP', dataIndex: 'ip', width: 130 },
                { text: '操作人', dataIndex: 'account', width: 80},
                { text: '操作时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'Y-m-d H:i:s', width: 150 }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                }
            ]
        });

        me.callParent();
    },
    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch(dataIndex) {
            case 'content':
                metaData.tdAttr = 'data-qtip="' + record.get('content') + '"';
                return value;
                break;
            default:
                return value;
        }
    }
});
