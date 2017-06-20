Ext.define('Admin.view.auth.acl.AclMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'auth-acl-mform',

    controller: 'auth-acl',

    maximizable: false,

    initComponent: function() {
        var me = this;

        var form = Ext.create({
            xtype: 'form',

            layout: 'anchor',
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                labelAlign: 'right',
                msgTarget: 'side',
                beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
            },

            defaultType: 'textfield',

            items: [
                {
                    fieldLabel: 'userInfoId',
                    name: 'id',
                    hidden: true
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: '姓名',
                    name: 'name',
                    hidden: true
                },
                {
                    xtype: 'fieldcontainer',
                    itemId: 'form-userInfo',
                    fieldLabel: '用户',
                    layout: 'fit',
                    items: {
                        xtype: 'gridpanel',
                        itemId: 'form-grid-userInfo',
                        scrollable: true,
                        width: 220,
                        height: 200,
                        columnLines: true,
                        loadMask: true,
                        //border: false,
                        hideHeaders: true,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        selModel: {
                            selType: 'checkboxmodel'
                        },
                        store: {
                            fields: ['text', 'value']
                        },
                        columns: [
                            { dataIndex: 'id', text: 'ID', hidden: true },
                            { dataIndex: 'account', text: '名称', flex: 1 }
                        ],
                        tbar: [
                            {
                                xtype: 'combo',
                                itemId: 'form-combo-userInfo',
                                store: {
                                    proxy: {
                                        type: 'ajax',
                                        url: '/cn/admin/accountListNoPageNumber',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'data'
                                        }
                                    },
                                    fields: ['id', 'account']
                                },
                                queryParam: 'q',
                                displayField: 'account',
                                valueField: 'id',
                                triggerAction: 'all',
                                typeAhead: true,
                                typeAheadDelay: 350,
                                forceSelection: true, // 限制期值只能是Store中的值,
                                //multiSelect: true,// 多选

                                // autocomplete
                                minChars: 1,
                                //pageSize: 10,

                                emptyText: '请输入账号',
                                matchFieldWidth: false, // 取消下拉选择器与表单宽度一致的规定
                                listConfig: { // 下拉选择器的配置
                                    width: 200
                                },
                                listeners: {
                                    select: function(combo, record, eOpts) {
                                        var userInfoCom = combo.up('form').down('#form-grid-userInfo'), // 已选择
                                            userInfoComStore = userInfoCom.getStore();

                                        if(userInfoComStore.getCount() > 0) {
                                            for(var i = 0; i < userInfoComStore.getCount(); i++) {
                                                if(userInfoComStore.getAt(i).get('id') == record.get('id')) {
                                                    break;
                                                } else {
                                                    userInfoComStore.add(record);
                                                }
                                            }
                                        } else {
                                            userInfoComStore.add(record);
                                        }

                                    },
                                    beforequery: function(queryEvent) {
                                        //										查询被处理前触发。返回 false 或者设置cancel参数为true可以取消查询。
                                        if(!queryEvent.query) {
                                            queryEvent.cancel = true;
                                        }
                                    }
                                }
                            }, '->', {
                                iconCls: 'x-fa fa-minus-circle',
                                componentCls: 'admin-color-red',
                                handler: 'onDeleteUserInfoBtnByFormClicked'
                            }]
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '角色',
                    layout: 'fit',
                    items: {
                        xtype: 'itemselector',
                        name: 'role_ids',
                        itemId: 'role_ids',
                        width: '100%',
                        height: 200,
                        scrollable: 'y',
                        imagePath: '../ux/images/',
                        buttons: [
                            'add', 'remove'
                        ],
                        buttonsText: [
                            '增加', '删除'
                        ],
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: '/cn/admin/authRoleList',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                }
                            },
                            autoLoad: true
                        },
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        msgTarget: 'side'
                    }
                }
            ],
            buttons: [
                {
                    text: '重置',
                    iconCls: 'x-fa fa-undo',
                    action: 'reset',
                    handler: 'onResetBtnClicked'
                },
                {
                    text: '提交',
                    iconCls: 'x-fa fa-floppy-o',
                    tooltip: '快捷键：Ctrl+Enter',
                    disabled: true,
                    formBind: true,  // 表单验证通过后才能点击
                    action: 'submit',
                    handler: 'onSubmitBtnClicked'
                }
            ]
        });


        Ext.apply(me, {
            items: form,
            listeners: {
                beforeshow: 'onResetBtnClicked'
            }
        });

        me.callParent();
    }

});