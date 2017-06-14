Ext.define('Admin.view.template.TemplateMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'template-mgrid',


    viewModel: {
        stores: {
            templateType: [
                [1, '文章模板'],
                [2, '栏目模板'],
                [3, '区块模板'],
                [4, '内嵌模板']
            ]
        }
    },

    initComponent: function () {
        var me = this,
            viewModel = me.getViewModel();

        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/templateList',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                // todo edit {dataIndex}

                {text: '模板ID', dataIndex: 'id', width: 100},
                {
                    text: '名称 <span class="admin-color-red">+</span>',
                    dataIndex: 'name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    flex: 1
                },
                {
                    text: '文件 <span class="admin-color-red">+</span>',
                    dataIndex: 'fileName',
                    /*editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },*/
                    width: 250
                },
                {
                    text: '模板类型 <span class="admin-color-red">+</span>',
                    dataIndex: 'type',
                    editor: {
                        xtype: 'combo',
                        //store: viewModel.getStore('templateType'),
                        store: [
                            [1, '文章模板'],
                            [2, '栏目模板'],
                            [3, '区块模板'],
                            [4, '内嵌模板']
                        ],
                        editable: false, // 不允许编辑
                        triggerAction: 'all',
                        forceSelection: true,
                        allowBlank: false
                    },
                    renderer: me.renderer,
                    width: 250
                },
                // {text: '栏目', dataIndex: 'cId'},
                {
                    text: '状态',
                    dataIndex: 'status',
                    editor: {
                        xtype: 'combo',
                        store: [
                            [1, '启用'],
                            [-2, '内置']
                        ],
                        editable: false, // 不允许编辑
                        triggerAction: 'all',
                        forceSelection: true,
                        allowBlank: false
                    },
                    renderer: me.renderer
                },
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '修改时间', dataIndex: 'updateDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '新增',
                    disabled: true, // 先禁用
                    iconCls: 'x-fa fa-plus-circle',
                    action: 'add'
                },
                {
                    xtype: 'button',
                    text: '保存',
                    iconCls: 'x-fa fa-floppy-o',
                    disabled: true, // 先禁用
                    action: 'save'
                },
                {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'x-fa fa-trash-o',
                    disabled: true, // 先禁用
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
                    case -2:
                        metaData.tdStyle = 'color:#0066FF';
                        return '内置';
                    case 1:
                        metaData.tdStyle = 'color:green';
                        return '启用';
                }
            case 'type':
                return view.ownerGrid.getViewModel().getStore('templateType')[value - 1][1];
            default:
                return value;
        }
    }
});
