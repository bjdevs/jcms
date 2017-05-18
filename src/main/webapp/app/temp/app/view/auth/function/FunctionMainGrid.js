Ext.define('Admin.view.auth.function.FunctionMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'auth-function-mgrid',

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
                    url: _ADMIN.root + '/auth-function/list.do',
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
                {
                    text: '名称 <span class="admin-color-red">+</span>',
                    dataIndex: 'name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
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
            },
            plugins: [{
                ptype: 'cellediting',
                clicksToEdit: 2
            }]
        });

        me.callParent();
    }
});
