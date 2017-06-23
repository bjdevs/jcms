Ext.define('Admin.view.serial.SerialGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'serial-mgrid',

    plugins: {
        ptype: 'cellediting',
        <!--1单击、2双击-->
        clicksToEdit: 1
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/serial/serialList',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    },
                    remoteSort: true
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
                    text: '连载名称 <span class="admin-color-red">+</span>',
                    dataIndex: 'name',
                    width: 150,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '描述 <span class="admin-color-red">+</span>',
                    dataIndex: 'depict',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '目录模版',
                    dataIndex: 'fileName',
                    width: 130
                },
                {
                    text: '状态 <span class="admin-color-red">+</span>',
                    dataIndex: 'status',
                    width: 100,
                    align: 'center',
                    editor: {
                        xtype: 'combo',
                        // todo ? 不明白为什么这样调用,下拉列表出不来
                        //store: viewModel.getStore('templateType'),
                        store: [
                            [0, '断更'],
                            [5, '连载中'],
                            [9, '已完结']
                        ],
                        editable: false, // 不允许编辑
                        triggerAction: 'all',
                        forceSelection: true,
                        allowBlank: false
                    },
                    renderer: me.readerer
                },
                {
                    text: '创建时间',
                    dataIndex: 'createDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    format: 'y-m-d H:i:s',
                    width: 130
                },
                {
                    text: '修改时间',
                    dataIndex: 'updateDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    format: 'y-m-d H:i:s',
                    width: 130
                },
                {
                    text: '操作',
                    dataIndex: 'url',
                    renderer: me.readerer,
                    flex: 1
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'x-fa fa-plus-circle',
                    action: 'add'
                },
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
                    disabled: true,
                    iconCls: 'x-fa fa-trash-o',
                    action: 'remove'
                },
                '-',
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                },
                '->',
                {
                    xtype: 'label',
                    html: '如果已有连载文章，则不进行删除。',
                    style: {
                        'color': 'crimson'
                    }
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

        switch (dataIndex) {
            case 'status':
                switch (value) {
                    case 0:
                        metaData.tdStyle = 'color:red';
                        return '断更';
                    case 5:
                        metaData.tdStyle = 'color:black';
                        return '连载中';
                    case 9:
                        metaData.tdStyle = 'color:#0095F8';
                        return '已完结';
                }
            case 'url':
                metaData.tdStyle = 'text-decoration-line: none;';
                return '<a href="' + value + '" target="_blank">' + value + '</a>';
            default:
                return value;

        }

    }

});