Ext.define('Admin.view.media.MediaSearchPanel', {
    extend: 'Admin.view.common.panel.BaseSearchPanel',
    xtype: 'media-sp',

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
                            fieldLabel: '标题',
                            emptyText: '',
                            itemId: 'search-title' // todo edit {-id}
                        },
                        {
                            itemId: 'search-type', // todo edit {-id}
                            fieldLabel: '类型',
                            xtype: 'combo',
                            store: [
                                [0, '全部'],
                                [MEDIA_TYPE_PICTURE, '图片'],
                                [MEDIA_TYPE_AUDIO, '音频'],
                                [MEDIA_TYPE_DOCUMENT, '文档']
                            ],
                            editable: false // 不允许编辑
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '开始日期',
                            itemId: 'search-startdate',
                            vtype: 'daterange',
                            endDateField: 'search-enddate',
                            editable: false,
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '结束日期',
                            itemId: 'search-enddate',
                            vtype: 'daterange',
                            editable: false,
                            startDateField: 'search-startdate',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d'
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
