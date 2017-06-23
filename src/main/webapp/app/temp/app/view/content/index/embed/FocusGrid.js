Ext.define('Admin.view.content.index.embed.FocusGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-headline-focus-mgrid',

    requires: [
        'Admin.view.content.index.embed.FocusController'
    ],

    controller: 'content-index-embed-focus',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/headLine',
                    extraParams: {
                        category: 'focus',
                        type: 'pic'
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
                {
                    text: '次序 <span class="admin-color-red">+</span>',
                    dataIndex: 'cateOrderBy',
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false,// 不允许小数
                        minValue: 0
                    },
                    width: 80
                },
                {
                    text: '状态', dataIndex: 'status', renderer: me.renderer, width: 80,
                    editor: {
                        xtype: 'combo',
                        store: [
                            [0, '未发'],
                            [9, '已发']
                        ],
                        editable: false, // 不允许编辑
                        triggerAction: 'all',
                        forceSelection: true,
                        allowBlank: false
                    }
                },
                {
                    text: '标题', dataIndex: 'name', renderer: me.renderer, flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                // {text: '栏目', dataIndex: 'category', width: 150},
                {text: '文章栏目', dataIndex: 'categoryArticle', width: 150},
                {text: '套红 <span class="admin-color-red">+</span>', dataIndex: 'redStatus', xtype: 'checkcolumn'},
                {text: '创建人', dataIndex: 'creator'},
                {text: '加入时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '更新时间', dataIndex: 'updateDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '保存',
                    iconCls: 'x-fa fa-floppy-o',
                    disabled: true,
                    action: 'save'
                },
                {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'x-fa fa-trash-o',
                    disabled: true,
                    action: 'delete'
                },
                '-',
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                }
            ],
            plugins: [{
                ptype: 'cellediting',
                clicksToEdit: 1
            }]
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
                        return '未发';
                    case 9:
                        metaData.tdStyle = 'color:#7DB336';
                        return '已发';
                    default:
                        return value;
                }
            case 'title':
                var redStatus = record.get('redStatus');
                return redStatus == 1 ? '<span class="admin-color-red">' + value + '</span>' : value;
            case 'headlinePic':
                switch (value) {
                    case 2:
                        return '<span class="x-fa fa-picture"></span>';
                    case 0:
                        return '<span class="x-fa fa-picture-o"></span>';
                }
            default:
                return value;
        }
    }
});
