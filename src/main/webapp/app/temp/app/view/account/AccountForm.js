Ext.define('Admin.view.account.AccountForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'account-mform',

    requires: [
        'Admin.view.account.AccountController'
    ],

    controller: 'account',

    width: 480,

    initComponent: function () {
        var me = this;

        var form = Ext.create({
            xtype: 'form',

            layout: 'anchor',
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelAlign: 'right',
                msgTarget: 'side',
                beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
            },

            defaultType: 'textfield',

            items: [
                {
                    name: 'account',
                    fieldLabel: '账号',
                    allowBlank: false,
                    beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                    emptyText: '请谨慎填写账户名，保存后无法修改',
                    maxLength: 20,
                    maxLengthText: "账户名不能超过20个字"
                },
                {
                    name: 'name', // todo edit
                    beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                    fieldLabel: '姓名',
                    allowBlank: false,
                    emptyText: '请填写您的姓名',
                    maxLength: 20,
                    maxLengthText: "姓名不能超过20个字"
                },
                {
                    inputType: 'password',
                    itemId: 'new-password',
                    name: 'new-password', // todo edit
                    beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                    fieldLabel: '新密码',
                    allowBlank: false,
                    blankText: '6-20位，由数字、字母(大小写)、特殊符号构成',
                    emptyText: '6-20位，由数字、字母(大小写)、特殊符号构成'
                },
                {
                    vtype: 'password',
                    inputType: 'password',
                    initialPassField: 'new-password',
                    name: 'password', // todo edit
                    beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                    fieldLabel: '密码确认',
                    allowBlank: false,
                    blankText: '再次输入新密码进行确认'
                },
                {
                    vtype: 'phone',
                    name: 'phone', // todo edit
                    emptyText: '请输入11位手机号码',
                    fieldLabel: '手机'
                },
                {
                    vtype: 'email',
                    name: 'mail', // todo edit
                    fieldLabel: '邮箱',
                    maxLength: 50,
                    maxLengthText: "邮箱不能超过50个字符"
                },
                {
                    xtype: 'textarea',
                    name: 'depict', // todo edit
                    fieldLabel: '描述',
                    beforeLabelTextTpl: '',
                    maxLength: 50,
                    maxLengthText: "描述不能超过50个字符"
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
                    handler: 'onAddUserSubmitBtnClicked'
                }
            ]
        });


        Ext.apply(me, {
            items: form
        });

        me.callParent();
    }

});