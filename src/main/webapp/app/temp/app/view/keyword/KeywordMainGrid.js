Ext.define('Admin.view.keyword.KeywordMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'keyword-mgrid',

    iconCls: 'x-fa fa-list-ul',
    title: '标签列表',

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Admin.store.API', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/keyWordList',
                    extraParams: {
                        type: 'list'
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

                {text: 'ID', dataIndex: 'id', width: 60},
                {
                    text: '名称 <span class="admin-color-red">+</span>',
                    dataIndex: 'name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    width: 250
                },
                {
                    text: '描述 <span class="admin-color-red">+</span>',
                    dataIndex: 'depict',
                    editor: {
                        xtype: 'textarea',
                        allowBlank: false
                    },
                    flex: 1
                },
                {text: '计数', dataIndex: 'count'},
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '更新时间', dataIndex: 'updateDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
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
                clicksToEdit: 2
            }],

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
                        return '内置';
                    case 1:
                        metaData.tdStyle = 'color:green';
                        return '启用';
                }
            case 'title':
                //return '<a href=""/>'; // todo edit
                return value;
            default:
                return value;
        }
    }
});
