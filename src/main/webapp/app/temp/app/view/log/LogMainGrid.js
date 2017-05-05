Ext.define('Admin.view.log.LogMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'log-mgrid',


    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: 'data/logs.json',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                { text: '模块', dataIndex: 'name', width: 120 },
                { text: '动作', dataIndex: 'action', width: 100 },
                { text: '详情', dataIndex: 'content', renderer: me.renderer, flex: 1 },
                { text: '操作者', dataIndex: 'user_name', width: 100 },
                { text: 'IP', dataIndex: 'ip', width: 150 },
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
                var returnStr = (value && typeof value === 'object') ? JSON.stringify(value) : value;
                // metaData.tdAttr = 'data-qtip="' + returnStr + '"';

                // 使用Ext.JSON会导致中文乱码
                // return (value && typeof value === 'object') ? Ext.JSON.encode(value) : value;

                return returnStr;
            default:
                return value;
        }

    }
});
