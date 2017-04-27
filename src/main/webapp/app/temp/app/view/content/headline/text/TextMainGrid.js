Ext.define('Admin.view.content.headline.text.TextMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-headline-text-mgrid',

    requires: [
        'Admin.view.content.headline.text.TextController'
    ],

    controller: 'content-headline-text',

    initComponent: function () {
        var me = this,
            viewModel = me.getViewModel();


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: 'data/texts.json',
                    extraParams: {
                        category: viewModel.get('category') || ''
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
                    dataIndex: 'rank',
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false,// 不允许小数
                        minValue: 0
                    },
                    width: 80
                },
                {text: '状态', dataIndex: 'status', renderer: me.renderer, width: 80},
                {text: '标题', dataIndex: 'title', renderer: me.renderer, flex: 1},
                {text: '栏目', dataIndex: 'category', width: 150},
                {text: '套红 <span class="admin-color-red">+</span>', dataIndex: 'redStatus', xtype: 'checkcolumn'},
                {text: '创建人', dataIndex: 'creator'},
                {text: '加入时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '更新时间', dataIndex: 'lastChange', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}

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
                    action: 'content-headline-picture'
                }
            ],
            plugins: [{
                ptype: 'cellediting',
                clicksToEdit: 2
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
            /* case 'rank':
             var up = '<button class="x-fa fa-arrow-up admin-label-button" action="set-rank-up" title="升级"></button>',
             down = '<button class="x-fa fa-arrow-down admin-label-button" action="set-rank-down" title="降级"></button>';

             return value + '&nbsp;&nbsp;' + up + down;*/
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
