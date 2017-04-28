Ext.define('Admin.view.log.LogSearchPanel', {
    extend: 'Admin.view.common.panel.BaseSearchPanel',
    xtype: 'log-sp',

    initComponent: function () {
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
                                type: 'logStore',
                                isPage: false,
                                isSearch: true,
                                proxy: {
                                    extraParams: {
                                        method: 'group-list',
                                        group: 'module'
                                    }
                                }
                            },
                            displayField: 'module',
                            valueField: 'module',
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
                                type: 'logStore',
                                isPage: false,
                                isSearch: true,
                                proxy: {
                                    extraParams: {
                                        method: 'group-list',
                                        group: 'action'
                                    }
                                }
                            },
                            displayField: 'action',
                            valueField: 'action',
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