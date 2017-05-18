Ext.define('Admin.view.content.ContentMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-mgrid',

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
        var me = this,
            category = location.hash.split('-'),
            category = category[category.length - 1];

        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                remoteFilter: true,
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/articleList',
                    extraParams:{
                        category: category
                    },
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
                {text: '状态', dataIndex: 'status', renderer: me.renderer, width: 80},
                {text: '标题', dataIndex: 'title', renderer: me.renderer, flex: 1},
                {text: '栏目', dataIndex: 'category', width: 150},
                {text: '作者', dataIndex: 'author'},
                {text: '创建人', dataIndex: 'creator'},
                {text: '头条', dataIndex: 'hAId', renderer: me.renderer},
                {text: '图片', dataIndex: 'hPId', renderer: me.renderer},
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '更新时间', dataIndex: 'updateDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}

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
                    text: '审核',
                    iconCls: 'x-fa fa-check-circle-o',
                    disabled: true,
                    action: 'audit'
                },
                {
                    xtype: 'button',
                    text: '返工',
                    iconCls: 'x-fa fa-undo',
                    disabled: true,
                    action: 'rework'
                },
                {
                    xtype: 'button',
                    text: '移动',
                    iconCls: 'x-fa fa-exchange',
                    disabled: true,
                    action: 'move'
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
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    disabled: true,
                    action: 'release'
                },
                '-',
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                },
                '->',
                {
                    xtype: 'button',
                    text: '栏目头条列表',
                    userCls: 'admin-label-button',
                    action: 'content-headline-text'
                },
                {
                    xtype: 'button',
                    text: '栏目图片列表',
                    userCls: 'admin-label-button',
                    action: 'content-headline-picture'
                },
                {
                    xtype: 'button',
                    text: '栏目预览',
                    userCls: 'admin-label-button',
                    action: 'preview'
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
            case 'status':
                switch (value) {
                    case 0:
                        metaData.tdStyle = 'color:#0066FF';
                        return '初稿';
                    case 1:
                        metaData.tdStyle = 'color:blank';
                        return '已签';
                    case 5:
                        metaData.tdStyle = 'color:#FF6633';
                        return '返工';
                    case 9:
                        metaData.tdStyle = 'color:#7DB336';
                        return '已发';
                    default:
                        metaData.tdStyle = 'color:red';
                        return value;
                }
            case 'hAId':
                if(value == 0){
                    return '<button class="x-fa fa-flag admin-label-button admin-color-gray" action="cancel-text-headline"></button>';
                } else {
                    return '<button class="x-fa fa-flag admin-label-button admin-color-purple" action="set-text-headline"></button>';
                }
                /*switch (value) {
                    case 1:
                        return '<button class="x-fa fa-flag admin-label-button admin-color-purple" action="set-text-headline"></button>';
                    case 0:
                        return '<button class="x-fa fa-flag admin-label-button admin-color-gray" action="cancel-text-headline"></button>';
                }*/
            case 'hPId':
                if(value == 0){
                    return '<button class="x-fa fa-picture-o admin-label-button admin-color-gray" action="cancel-picture-headline"></button>';
                } else {
                    return '<button class="x-fa fa-picture-o admin-label-button admin-color-purple" action="set-picture-headline"></button>';
                }
                /*switch (value) {
                    case 2:
                        return '<button class="x-fa fa-picture-o admin-label-button admin-color-purple" action="set-picture-headline"></button>';
                    case 0:
                        return '<button class="x-fa fa-picture-o admin-label-button admin-color-gray" action="cancel-picture-headline"></button>';
                }*/
            default:
                return value;
        }
    }
});
