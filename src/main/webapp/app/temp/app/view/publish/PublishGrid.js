Ext.define('Admin.view.publish.PublishGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'publish-mgrid',


    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/publishList',
                    // pagination: false,
                    remoteSort: true,
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                {
                    text: 'ID',
                    dataIndex: 'id',
                    width: 50
                },
                {
                    text: '发布人',
                    dataIndex: 'user',
                    flex: 1
                },
                {
                    text: '发布栏目',
                    dataIndex: 'category',
                    flex: 1
                },
                {
                    text: '请求时间',
                    dataIndex: 'requestDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    format: 'y-m-d H:i:s',
                    flex: 1
                },
                {
                    text: '发布状态',
                    dataIndex: 'status',
                    flex: 1,
                    align: 'center',
                    renderer: me.readerer
                },
                {
                    text: '完成时间',
                    dataIndex: 'finishDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    format: 'y-m-d H:i:s',
                    flex: 1
                }
            ],

            tbar: [
                {
                    xtype: 'button',
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    action: 'publish'
                },
                '-',
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                },
                '-',
                {
                    xtype: 'button',
                    text: '重建索引',
                    iconCls: 'x-fa fa-link',
                    action: 'rebuildallpublishindex'
                },
                '-',
                {
                    xtype: 'button',
                    text: '查看首页',
                    iconCls: 'x-fa fa-eye',
                    action: 'redirect'
                }
            ]
        });
        me.callParent();
    },

    readerer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch (dataIndex){
            case 'status':
                switch (value){
                    case 0:
                        metaData.tdStyle = 'color:red';
                        return '失败';
                    case 1:
                        metaData.tdStyle = 'color:green';
                        return '成功';
                }
            default:
                return value;
        }
    }
});