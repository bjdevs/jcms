Ext.define('Admin.view.log.LogSearchPanel', {
    extend: 'Admin.view.common.panel.BaseSearchPanel',
    xtype: 'log-sp',

    initComponent: function() {
        var me = this;

        var defaults = me.subDefaults;

        Ext.apply(me, {
            items: [
                {
                    defaults: defaults,
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: '模块',
                            itemId: 'search-module',
                            store: {
                                proxy: {
                                    type: 'ajax',
                                    url: _ADMIN.root + '/log/select.do',
                                    extraParams: {
                                        groupField: 'module'
                                    },
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'rows'
                                    }
                                }
                            },
                            displayField: 'text',
                            valueField: 'text',
                            queryMode: 'remote',
                            triggerAction: 'all',
                            typeAhead: true,
                            forceSelection: true
                        },
                        {
                            // 手动输入条件时会进行二次远程查询 TODO
                            xtype: 'combo',
                            fieldLabel: '动作',
                            itemId: 'search-action',
                            store: {
                                proxy: {
                                    type: 'ajax',
                                    url: _ADMIN.root + '/log/select.do',
                                    extraParams: {
                                        groupField: 'action'
                                    },
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'rows'
                                    }
                                }
                            },
                            displayField: 'text',
                            valueField: 'text',
                            queryMode: 'remote',
                            triggerAction: 'all',
                            typeAhead: true,
                            forceSelection: true
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '模糊查询',
                            emptyText: '操作者',
                            itemId: 'search-query',
                            width: 300
                        },
                        {
                            xtype: 'button',
                            text: '查询',
                            iconCls: 'x-fa fa-search',
                            action: 'search'
                        },
                        {
                            xtype: 'button',
                            text: '重置',
                            iconCls: 'x-fa fa-undo',
                            action: 'reset'
                        }
                    ]
                }
            ]
        });

        me.callParent();
    }

});