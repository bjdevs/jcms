Ext.define('Admin.view.login.Login', {
    extend: 'Ext.window.Window',
    xtype: 'login',

    requires: [
        'Admin.view.login.LoginController',
        'Admin.view.main.MainModel'
    ],

    title: '帐号登录',
    iconCls: 'x-fa fa-user',
    bodyPadding: 5,
    width: 400,

    frame: true,
    modal: true,// 模态窗
    //plain: true, // 纯色效果-主要用于window
    closeAction: 'hide', // 关闭窗口动作
    closable: false,// 不要关闭按钮
    constrain: true,// 固定在父view中
    constrainHeader: true, // 固定在浏览器内
    resizable: false, // 不支持手动更改窗口大小

    autoShow: true,

    controller: 'login',
    viewModel: 'main',

    keyMap: {
        'ENTER': 'onSubmitBtnClicked',
        scope: 'controller'
    },

    defaults: {
        border: false
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me, {

            items: [

                {
                    html: '<img src="http://www.hmlzs.cn/static/lzs/images/logo.png" width="281" height="58"/>',
                    userCls: 'admin-login-logo'
                },
                {
                    xtype: 'form',
                    url: _am.login.submitURL + location.search,  // todo edit
                    method: "POST",

                    baseCls: 'x-plain',

                    layout: 'form',

                    defaults: {
                        anchor: '100%',
                        labelWidth: 60,
                        labelAlign: 'right',
                        msgTarget: 'side',
                        beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
                    },

                    defaultType: 'textfield',

                    items: [
                        /*{
                            xtype: 'displayfield',
                            fieldCls: 'c-red',
                            value: _am.login.error // todo edit
                        },*/
                        {
                            fieldLabel: '帐号',
                            name: 'account', // todo edit
                            reference: 'username',
                            publishes: 'value',
                            allowBlank: false,
                            blankText: '请填写您的帐号'
                        },
                        {
                            inputType: 'password',
                            name: 'password', // todo edit
                            fieldLabel: '密码',
                            allowBlank: false,
                            blankText: '请填写您的帐号密码'
                        }/*,
                        {
                            xtype: 'hidden',
                            name: 'return',
                            value: _am.login.returnURL + location.search // todo edit
                        }*/
                    ],
                    buttons: [
                        /*{
                            xtype: 'tbtext',
                            bind: {
                                html: '<a href="' + _am.login.editPasswordURL + '{username.value}' + '">忘记密码？</a>' // todo edit
                            }

                        },
                        '->',*/
                        {
                            text: '重置',
                            iconCls: 'x-fa fa-undo',
                            action: 'reset',
                            handler: 'onResetBtnClicked'
                        },
                        {
                            text: '登录',
                            iconCls: 'x-fa fa-sign-in',
                            tooltip: '快捷键：Enter',
                            disabled: true,
                            formBind: true,  // 表单验证通过后才能点击
                            action: 'submit',
                            handler: 'onSubmitBtnClicked'
                        }

                    ]

                }]


        });

        me.callParent();
    }
});