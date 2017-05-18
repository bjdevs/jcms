Ext.define('Admin.view.auth.acl.AclMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'auth-acl-mgrid',

    viewModel: {
        data: {
            rowCount: null
        }
    },

    initComponent: function() {
        var me = this,
            vm = me.getViewModel();


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: _ADMIN.root + '/auth-acl/list.do',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true,
                listeners: {
                    load: function(store, records, successful, operation, eOpts) {
                        vm.set('rowCount', records.length);
                    }
                }
            }),
            columns: [
                { text: 'ID', dataIndex: 'id', width: 80 },
                { text: '用户名', dataIndex: 'account' },
                { text: '姓名', dataIndex: 'name' },
                { text: '部门', dataIndex: 'department', renderer: me.renderer, width: 200 },
                { text: '角色', dataIndex: 'role_names', renderer: me.renderer, flex: 1 }
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
            ],
            bbar: {
                items: [
                    '->', {
                        xtype: 'component',
                        bind: '共 {rowCount} 条'
                    }
                ]
            }
        });

        me.callParent();
    },
    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch(dataIndex) {
            case 'description':
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
