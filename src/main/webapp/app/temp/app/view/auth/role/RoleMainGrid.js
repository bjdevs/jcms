Ext.define('Admin.view.auth.role.RoleMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'auth-role-mgrid',

    // Reusable actions
    actions: {
        preview: {
            iconCls: 'x-fa fa-file-excel-o c-forestgreen',
            tooltip: '预览',
            handler: 'onDownloadFileBtnClick'
        },
        add: {
            iconCls: 'x-fa fa-file-excel-o c-forestgreen',
            tooltip: '新增子栏目',
            handler: 'onDownloadFileBtnClick'
        },
        article: {
            iconCls: 'x-fa fa-building',
            tooltip: '文章列表',
            handler: 'onCreateOrderBtnClicked'
        },
        headline: {
            iconCls: 'x-fa fa-search-plus',
            tooltip: '头条列表',
            handler: 'onSearchOrderBtnClicked'
        },
        picture: {
            iconCls: 'x-fa fa-calendar',
            tooltip: '图片列表',
            handler: 'onAdInfoBtnClicked'
        }

    },


    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: 'data/roles.json',
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
                {text: '名称', dataIndex: 'name'},
                {text: '级别', dataIndex: 'rank'},
                {text: '描述', dataIndex: 'depict', renderer: me.renderer, width: 200},
                {text: '功能', dataIndex: 'function_names', renderer: me.renderer, flex: 1}
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
                    text: '修改',
                    iconCls: 'x-fa fa-pencil-square-o',
                    disabled: true,
                    action: 'edit'
                },
                '-',
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
            case 'depict':
                metaData.tdAttr = 'data-qtip="' + value + '"';
                return value;
            case 'function_names':
                metaData.tdAttr = 'data-qtip="' + value + '"';
                return value.join(",");
            default:
                return value;
        }
    }
});
