Ext.define('Admin.view.content.ContentSearchPanel', {
    extend: 'Admin.view.common.panel.BaseSearchPanel',
    xtype: 'content-sp',

    initComponent: function () {
        var me = this;

        var defaults = me.subDefaults;

        Ext.apply(me, {
            items: [
                {
                    defaults: defaults,
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: '文章ID',
                            emptyText: '如：100015',
                            itemId: 'search-id' // todo edit {-id}
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '文章标题',
                            emptyText: '支持模糊匹配',
                            itemId: 'search-title'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '开始日期',
                            itemId: 'search-startdate',
                            vtype: 'daterange',
                            endDateField: 'search-enddate',
                            editable: false,
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',
                            emptyText: '请选择创建时间'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '结束日期',
                            itemId: 'search-enddate',
                            vtype: 'daterange',
                            editable: false,
                            startDateField: 'search-startdate',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',
                            emptyText: '请选择创建时间'
                        },
                        {
                            xtype: 'button',
                            text: '查询',
                            iconCls: 'x-fa fa-search',
                            action: 'search',
                            handler: 'onSearchPanelQuery'
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