Ext.define('Admin.view.media.MediaGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'media-mgrid',

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: './mediaList',
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        totalProperty: 'totalData'
                    },
                    extraParams: {
                        type: 0,
                        pageSize: pageSize
                    }
                },
                autoLoad: true
            }),
            columns: [
                // todo edit {dataIndex}
                {text: '序号', dataIndex: 'id', width: 80},
                {
                    text: '标题 <span class="admin-color-red">+</span>',
                    dataIndex: 'title',
                    width: 250,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '类型',
                    dataIndex: 'type',
                    width: 80,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        switch (value) {
                            case MEDIA_TYPE_PICTURE:
                                return '图片';
                            case MEDIA_TYPE_AUDIO:
                                return '音频';
                            case MEDIA_TYPE_DOCUMENT:
                                return '文档';
                            default :
                                return value;
                        }
                    }
                },
                {text: '地址', dataIndex: 'url', width: 400},
                {text: '预览', dataIndex: 'preview', width: 50},
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
                {text: '创建人', dataIndex: 'user', width: 80},
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '上传',
                    iconCls: 'x-fa fa-upload',
                    action: 'add'
                },
                {
                    xtype: 'button',
                    text: '启用',
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
                    text: '编辑',
                    iconCls: 'x-fa fa-pencil-square-o',
                    disabled: true,
                    action: 'edit'
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
                    text: '删除',
                    iconCls: 'x-fa fa-trash-o',
                    disabled: true,
                    action: 'delete'
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
