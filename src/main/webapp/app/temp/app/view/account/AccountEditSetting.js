Ext.define('Admin.view.account.AccountEditSetting', {
    extend: 'Ext.panel.Panel',
    xtype: 'account-setting',

    requires: [
        'Admin.view.account.AccountController'
    ],

    controller: 'account',

    keyMap: {
        'CTRL+ENTER': 'onEditSettingSubmitBtnClicked',
        scope: 'controller'
    },

    initComponent: function () {
        var me = this;


        // todo edit
        // 获取到当前登录用户信息
        var account = {
            id: _am.currentUser.id,
            account: _am.currentUser.account,
            name: _am.currentUser.name,
            phone: _am.currentUser.phone,
            mail: _am.currentUser.mail,
            depict: _am.currentUser.depict
        };

        Ext.apply(me, {

            items: {
                xtype: 'form',
                //layout: 'form',

                defaults: {
                    anchor: '50%',
                    labelAlign: 'right',
                    msgTarget: 'side'
                },

                bodyPadding: 10,
                buttonAlign: 'left',
                border: false,

                defaultType: 'textfield',

                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: '帐号',
                        value: account.account
                    },
                    /* start.默认显示 */
                    {
                        xtype: 'displayfield',
                        itemId: 'd-name',
                        fieldLabel: '姓名',
                        value: account.name
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'd-phone',
                        fieldLabel: '手机',
                        value: account.phone
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'd-email',
                        fieldLabel: '邮箱',
                        value: account.mail
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'd-desc',
                        fieldLabel: '描述',
                        value: account.depict
                    },
                    /* end.默认显示 */

                    /* start.默认不显示 */
                    {
                        itemId: 'v-name',
                        name: 'name', // todo edit
                        beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                        fieldLabel: '姓名',
                        hidden: true,
                        allowBlank: false,
                        blankText: '请填写您的姓名',
                        maxLength: 20,
                        maxLengthText: "姓名不能超过20个字",
                        value: account.name
                    },
                    {
                        itemId: 'v-phone',
                        vtype: 'phone',
                        name: 'phone', // todo edit
                        fieldLabel: '手机',
                        hidden: true,
                        value: account.phone
                    },
                    {
                        itemId: 'v-email',
                        vtype: 'email',
                        name: 'mail', // todo edit
                        fieldLabel: '邮箱',
                        maxLength: 50,
                        maxLengthText: "邮箱不能超过50个字符",
                        hidden: true,
                        value: account.mail
                    },
                    {
                        itemId: 'v-desc',
                        xtype: 'textarea',
                        name: 'depict', // todo edit
                        fieldLabel: '描述',
                        maxLength: 50,
                        maxLengthText: "描述不能超过50个字符",
                        hidden: true,
                        value: account.depict
                    },
                    {
                        name: 'account',
                        hidden: true,
                        value: account.account
                    },
                    {
                        name: 'id',
                        hidden: true,
                        value: account.id
                    }
                    /* end.默认不显示 */
                ],
                tbar: [
                    {
                        text: '修改',
                        iconCls: 'x-fa fa-pencil-square-o',
                        action: 'edit',
                        handler: 'onEditBtnClicked'
                    },
                    {
                        text: '取消',
                        iconCls: 'x-fa fa-undo',
                        hidden: true,
                        action: 'cancel',
                        handler: 'onCancelBtnClicked'
                    },
                    {
                        text: '更新',
                        iconCls: 'x-fa fa-floppy-o',
                        tooltip: '快捷键：Enter',
                        disabled: true,
                        formBind: true,  // 表单验证通过后才能点击
                        hidden: true,
                        action: 'submit',
                        handler: 'onEditSettingSubmitBtnClicked'
                    }
                ]
            }
        });

        me.callParent();

    }


});