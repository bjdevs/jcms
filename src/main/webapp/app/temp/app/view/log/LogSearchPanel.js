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
                            itemId: 'search-name',
                            store: [
                                [100, '全部'],
                                [101, "媒体管理"],
                                [102, '广告管理']
                            ],
                            editable: false // 不允许编辑
                        },
                        {
                            // 手动输入条件时会进行二次远程查询 TODO
                            xtype: 'combo',
                            fieldLabel: '动作',
                            itemId: 'search-action',
                            store: [
                                [100, "全部"],
                                [200, "新增"],
                                [201, "修改"],
                                [202, "删除"],
                                [203, "启用"],
                                [204, "废弃"],
                                [205, "初稿"],
                                [206, "已签"],
                                [207, "返工"],
                                [208, "已发"],
                                [209, "已删"]
                            ],
                            editable: false // 不允许编辑
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