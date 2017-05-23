Ext.define('Admin.view.log.LogMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'log-mgrid',

    initComponent: function() {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: './logList',
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
                { text: '模块', dataIndex: 'action', width: 150 },
                { text: '内容', dataIndex: 'content', width: 600 },
                { text: 'IP', dataIndex: 'ip', width: 180 },
                { text: '操作人', dataIndex: 'user', width: 80},
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
            case 'logDetail':
                if(value && typeof value === 'object') {
                    var returnStr = JSON.stringify(value);


                    // return '<a href="http://jsoneditoronline.org/?json=' + encodeURIComponent(returnStr) + '" target="_blank" title="查看完整JSON">' + returnStr + '</a>';
                    return '<button class="x-fa fa-magic admin-label-button admin-color-brown" action="show-json" title="想看我变魔术吗？赶快点击我吧！"></button>' + returnStr;
                }

                return value;
            default:
                return value;
        }
    }
});
