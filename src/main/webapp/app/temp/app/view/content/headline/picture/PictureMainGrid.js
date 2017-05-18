Ext.define('Admin.view.content.headline.picture.PictureMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-headline-picture-mgrid',

    requires: [
        'Admin.view.content.headline.picture.PictureController'
    ],

    controller: 'content-headline-picture',

    initComponent: function () {
        var me = this,
            viewModel = me.getViewModel();


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/headLine',
                    extraParams: {
                        category: viewModel.get('category') || '',
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
                {text: '状态', dataIndex: 'status', renderer: me.renderer, width: 80},
                {text: '标题', dataIndex: 'name', renderer: me.renderer, flex: 1},
                {text: '栏目', dataIndex: 'category', width: 150},
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
                },
                '->',
                {
                    xtype: 'button',
                    text: '栏目图片列表',
                    userCls: 'admin-label-button',
                    action: 'content-headline-text'
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
          /*  case 'rank':
                var up = '<a class="x-fa fa-arrow-up"></a>',
                    down = '<a class="x-fa fa-arrow-down"></a>';

                return value + '&nbsp;&nbsp;' + up + '&nbsp;' + down;*/
            case 'title':
                var redStatus = record.get('redStatus');
                return redStatus == 1 ? '<span class="admin-color-red">' + value + '</span>' : value;
            default:
                return value;
        }
    }
});
