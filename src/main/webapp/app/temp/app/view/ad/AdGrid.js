Ext.define('Admin.view.ad.AdGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'ad-mgrid',

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/admin/adList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'totalData'
                    },
                    extraParams: {
                        pageSize: pageSize
                    }
                },
                autoLoad: true
            }),
            columns: [
                // todo edit {dataIndex}
                {
                    text: '状态',
                    dataIndex: 'status',
                    width: 100,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        switch (value) {
                            case 1:
                                return '<span style="color: green">启用</span>';
                            case 0:
                                return '<span style="color: red">废弃</span>';
                            default :
                                return value;
                        }
                    }
                },
                {text: '序号', dataIndex: 'id', width: 80},
                {
                    text: '标题 <span class="admin-color-red">+</span>',
                    dataIndex: 'name',
                    width: 250,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '尺寸 <span class="admin-color-red">+</span>',
                    dataIndex: 'size',
                    width: 80,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '链接 <span class="admin-color-red">+</span>',
                    dataIndex: 'url',
                    width: 400,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '素材 <span class="admin-color-red">+</span>',
                    dataIndex: 'materialUrl',
                    width: 400,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {text: '更新人', dataIndex: 'user', width: 100},
                {text: '更新时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'x-fa fa-plus',
                    action: 'add'
                },
                {
                    xtype: 'button',
                    text: '审核',
                    iconCls: 'x-fa fa-check',
                    disabled: true,
                    action: 'enabled'
                },
                {
                    xtype: 'button',
                    text: '废弃',
                    iconCls: 'x-fa fa-ban',
                    disabled: true,
                    action: 'abandon'
                },
                {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'x-fa fa-trash-o',
                    disabled: true,
                    action: 'delete'
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
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    disabled: true,
                    action: 'publish'
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
            }]
        });

        me.callParent();
    },
    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch (dataIndex) {
            case 'id':
                var preview = '<button class="admin-label-button" action="preview" title="预览栏目">预览</button>',
                    add = '<button class="admin-label-button" action="add" title="新增子栏目">新增</button>',
                    article = '<button class="admin-label-button" action="article" title="文章列表">文章</button>',
                    headlineText = '<button class="admin-label-button" action="headlineText" title="栏目头条列表">头条</button>',
                    headlinePicture = '<button class="admin-label-button" action="picture" title="栏目图片列表">图片</button>';

                return preview + '' + add + '' + article + '' + headlineText + '' + headlinePicture;
            default:
                return value;
        }
    }
});
