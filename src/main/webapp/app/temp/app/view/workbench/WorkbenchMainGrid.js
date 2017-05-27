Ext.define('Admin.view.workbench.WorkbenchMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'workbench-mgrid',

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                remoteFilter: true,
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/articleList',
                    extraParams:{
                        category: 'all'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                // todo edit {dataIndex}

                {text: 'ID', dataIndex: 'id', width: 80},
                {text: '状态', dataIndex: 'status', renderer: me.renderer, width: 80},
                {text: '标题', dataIndex: 'title', renderer: me.renderer, flex: 1},
                {text: '栏目', dataIndex: 'category', width: 150},
                {text: '作者', dataIndex: 'author'},
                {text: '创建人', dataIndex: 'creator'},
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '更新时间', dataIndex: 'updateDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '审核',
                    iconCls: 'x-fa fa-check-circle-o',
                    disabled: true,
                    action: 'audit'
                },
                {
                    xtype: 'button',
                    text: '返工',
                    iconCls: 'x-fa fa-undo',
                    disabled: true,
                    action: 'rework'
                },
                {
                    xtype: 'button',
                    text: '移动',
                    iconCls: 'x-fa fa-exchange',
                    disabled: true,
                    action: 'move'
                },
                {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'x-fa fa-trash-o',
                    disabled: true,
                    action: 'delete'
                },
                {
                    xtype: 'button',
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    disabled: true,
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
                    tpl: '共 <strong>{article}</strong> 篇文章，<strong>{picture}</strong> 张图片，<strong>{voice}</strong> 条音频， 感恩您的努力！',
                    style: {
                        'color': 'crimson'
                    },
                    listeners: {
                        beforerender: function (panel, eOpts) {
                            Ext.Ajax.request({
                                url: '/cn/article/getFileInfo'
                            }).then(function (response, opts) {
                                    var obj = Ext.decode(response.responseText);
                                    panel.setHtml(obj);
                                },
                                function (response, opts) {
                                    Ext.log('server-side failure with status code ' + response.status);
                                });

                        }
                    }
                }
            ]
        });

        me.callParent();
    },
    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch (dataIndex) {
            case 'status':
                switch (value) {
                    case 0:
                        metaData.tdStyle = 'color:#0066FF';
                        return '初稿';
                    case 1:
                        metaData.tdStyle = 'color:blank';
                        return '已签';
                    case 5:
                        metaData.tdStyle = 'color:#FF6633';
                        return '返工';
                    case 9:
                        metaData.tdStyle = 'color:blank';
                        return '已发';
                    case 10:
                        metaData.tdStyle = 'color:red';
                        return '已删';
                }
            case 'title':
                //return '<a href=""/>'; // todo edit
                return value;
            default:
                return value;
        }
    }
});
