Ext.define('Admin.view.keyword.HotKeywordGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'hotkeyword-grid',

    iconCls: 'x-fa fa-free-code-camp',
    title: '热门标签',

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: 'data/keywords.json',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                // todo edit {dataIndex}

                {text: 'ID', dataIndex: 'id', width: 100},
                {text: '名称', dataIndex: 'name', width: 150},
                {text: '描述', dataIndex: 'desc', flex: 1},
                {text: '英文', dataIndex: 'ename', width: 250},
                {text: '计数', dataIndex: 'counter'}

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
