Ext.define('Admin.view.auth.role.RoleMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'auth-role-mform',

    controller: 'auth-role',

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
                    fieldLabel: 'roleId',
                    name: 'id',
                    hidden: true
                },
                {
                    name: 'name',
                    fieldLabel: '名称',
                    allowBlank: false,
                    blankText: '名称不能为空'
                },
                /*{
                    xtype: 'numberfield',
                    name: 'rank',
                    fieldLabel: '级别',
                    allowBlank: false,
                    allowDecimals: false,
                    minValue: 0,
                    value: 0
                },*/
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '功能',
                    layout: 'fit',
                    // maxHeight: 500,
                    items: {
                        xtype: 'itemselector',
                        name: 'function_ids',
                        itemId: 'function_ids',
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
                                url: '/cn/admin/authFunctionList',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                }
                            },
                            autoLoad: true
                        },
                        /*value:{
                            proxy: {
                                type: 'ajax',
                                url: '/cn/admin/authFunctionList',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                }
                            },
                            autoLoad: true
                        },*/
                        //value:[{"id":103,"name":"天津"},{"id":104,"name":"大连"},{"id":105,"name":"昆明"}],
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        blankText: '请选择要添加的权限',
                        msgTarget: 'side'
                        //fromTitle: '可用的',
                        //toTitle: '已选的'
                    }
                },
                {
                    xtype: 'textarea',
                    name: 'depict',
                    beforeLabelTextTpl: '',
                    fieldLabel: '描述',
                    maxLength: 255
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
            items: form
        });

        me.callParent();
    }

});