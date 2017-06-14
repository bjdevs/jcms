<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>黄梅老祖寺-登录</title>
    <!-- extjs.css -->
    <link href="//cdn.bootcss.com/extjs/6.2.0/classic/theme-neptune/resources/theme-neptune-all.css" rel="stylesheet">
    <link href="//cdn.bootcss.com/extjs/6.2.0/packages/ux/classic/neptune/resources/ux-all-debug.css" rel="stylesheet">
    <!-- font -->
    <!--<link href="//cdn.bootcss.com/extjs/6.2.0/packages/font-awesome/resources/font-awesome-all-debug.css" rel="stylesheet">-->
    <link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

    <!-- 自定义 -->
    <!-- admin.css -->
    <link href="/resources/css/admin-debug.css" rel="stylesheet">

    <!-- extjs.core -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/ext-all-debug.js"></script>
    <!-- extjs.ux -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/packages/ux/classic/ux-debug.js"></script>
    <!-- extjs.locale -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/classic/locale/locale-zh_CN-debug.js"></script>

    <!-- 自定义 -->
    <script src="/resources/extjs/ext-expand-debug.js"></script>

    <script>
        if (window.parent != window) {
            window.parent.location = window.location;
        }
    </script>

</head>
<body>
<script type="text/javascript">
    Ext.onReady(function () {

        function onSubmitBtnClicked(button) {
            var form = _login.down('form').getForm();
            if (form.isValid()) {
                form.submit({
                    url: "./login",
                    method: "POST",
                    //waitMsg: '登录中，稍等片刻...',
                    submitEmptyText: false,
                    success: function (_form, action) {
                        var result = action.result.result;
                        switch (result) {
                            case 'success' :
                                window.location.reload();
                                break;
                            case 'failed' :
                                Ext.Msg.alert("登录失败", action.result.message).setIcon(Ext.Msg.WARNING);
                            default :
                                break;
                        }
                    },
                    failure: function (_form, action) {
                        Ext.Msg.alert("错误", "服务器端异常，请联系管理员").setIcon(Ext.Msg.ERROR);
                    }
                });
            }
        }

        var _login = Ext.create('Ext.window.Window', {

            title: '帐号登录',
            iconCls: 'x-fa fa-user',
            bodyPadding: 5,
            width: 400,

            frame: true,
            modal: true,// 模态窗
//          plain: true, // 纯色效果-主要用于window
            closeAction: 'hide', // 关闭窗口动作
            closable: false,// 不要关闭按钮
            constrain: true,// 固定在父view中
            constrainHeader: true, // 固定在浏览器内
            resizable: false, // 不支持手动更改窗口大小

            autoShow: true,

            defaults: {
                border: false
            },

            keyMap: {
                'ENTER': onSubmitBtnClicked,
                scope: this
            },

            items: [
                {
                    html: '<img src="http://www.hmlzs.cn/static/lzs/images/logo.png" width="281" height="58"/>',
                    userCls: 'admin-login-logo'
                },
                {
                    xtype: 'form',
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
                        {
                            fieldLabel: '帐号',
                            name: 'account', // todo edit
                            allowBlank: false,
                            emptyText: '请填写帐户名'
                        },
                        {
                            inputType: 'password',
                            name: 'password', // todo edit
                            fieldLabel: '密码',
                            allowBlank: false,
                            emptyText: '请填写账户密码'
                        }
                    ],
                    buttons: [
                        {
                            text: '重置',
                            iconCls: 'x-fa fa-undo',
                            handler: function (button) {
                                button.up('form').getForm().reset();
                            }
                        },
                        {
                            text: '登录',
                            iconCls: 'x-fa fa-sign-in',
                            tooltip: '快捷键：Enter',
                            disabled: true,
                            formBind: true,  // 表单验证通过后才能点击
                            handler: onSubmitBtnClicked
                        }
                    ]
                }
            ]
        });
    });
</script>
</body>
</html>