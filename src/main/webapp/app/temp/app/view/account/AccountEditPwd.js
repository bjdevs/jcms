Ext.define('Admin.view.account.AccountEditPwd', {
    extend: 'Ext.panel.Panel',
    xtype: 'account-editpwd',

    requires: [
        'Admin.view.account.AccountController'
    ],

    controller: 'account',

    keyMap: {
        'CTRL+ENTER': 'onEditPwdSubmitBtnClicked',
        scope: 'controller'
    },

    initComponent: function () {
        var me = this;


        // todo edit
        // 获取到当前登录用户信息

        Ext.apply(me, {

            items: {
                xtype: 'form',

                defaults: {
                    anchor: '30%',
                    labelAlign: 'right',
                    msgTarget: 'side',
                    beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
                },

                bodyPadding: 10,
                buttonAlign: 'left',
                border: false,

                defaultType: 'textfield',

                items: [

                    {
                        inputType: 'password',
                        name: 'old-password', // todo edit
                        beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                        fieldLabel: '旧密码',
                        allowBlank: false,
                        blankText: '请填写您的旧密码'
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
                        name: 're-password', // todo edit
                        beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                        fieldLabel: '密码确认',
                        allowBlank: false,
                        blankText: '再次输入新密码进行确认'
                    },
                    /* start.默认不显示 */
                    {
                        name: 'id',
                        hidden: true,
                        value: _am.currentUser.id
                    }
                    /* end.默认不显示 */
                ],

                tbar: [
                    {
                        text: '更新',
                        iconCls: 'x-fa fa-floppy-o',
                        tooltip: '快捷键：Enter',
                        disabled: true,
                        formBind: true,  // 表单验证通过后才能点击
                        action: 'submit',
                        handler: 'onEditPwdSubmitBtnClicked'
                    }
                ]
            }
        });

        me.callParent();

    }


});