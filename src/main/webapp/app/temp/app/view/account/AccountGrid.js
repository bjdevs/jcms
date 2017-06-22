Ext.define('Admin.view.account.AccountGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'account-mgrid',

    requires: [
        'Admin.view.account.AccountController'
    ],

    controller: 'account',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/admin/accountList',
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
                {text: '序号', dataIndex: 'id', width: 80},
                {text: '账号', dataIndex: 'account', width: 100},
                {
                    text: '姓名 <span class="admin-color-red">+</span>',
                    dataIndex: 'name',
                    width: 100,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                // {text: '密码', dataIndex: 'password', width: 280},
                {
                    text: '手机 <span class="admin-color-red">+</span>',
                    dataIndex: 'phone',
                    width: 120,
                    editor: {
                        vtype: 'phone',
                        allowBlank: false,
                        maxLength: 20
                    }
                },
                {
                    text: '邮箱 <span class="admin-color-red">+</span>',
                    dataIndex: 'mail',
                    flex: 1,
                    editor: {
                        vtype: 'email',
                        allowBlank: false,
                        maxLength: 50
                    }
                },
                {text: '描述', dataIndex: 'depict', width: 250},
                {
                    text: '状态',
                    dataIndex: 'status',
                    flex: 1,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        switch (value) {
                            case 1:
                                return '<span style="color: green">启用</span>';
                            case 0:
                                return '<span style="color: red">禁用</span>';
                            default :
                                return value;
                        }
                    }
                },
                {text: '最后登录时间', dataIndex: 'lastLoginDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 130},
                {text: '更新时间', dataIndex: 'updateDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 130},
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 130}
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
                    text: '启用',
                    iconCls: 'x-fa fa-check',
                    disabled: true,
                    action: 'enabled'
                },
                {
                    xtype: 'button',
                    text: '禁用',
                    iconCls: 'x-fa fa-ban',
                    disabled: true,
                    action: 'abandon'
                },
                {
                    xtype: 'button',
                    text: '密码重置',
                    iconCls: 'x-fa fa-floppy-o',
                    disabled: true,
                    action: 'recover'
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