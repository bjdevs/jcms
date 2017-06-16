Ext.define('Admin.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onResetBtnClicked: function () {
        this.getView().down('form').getForm().reset();
    },
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var form = view.down('form').getForm();
        if (form.isValid()) {
            //form.submit();
            form.submit({
                url: "/cn/admin/login",
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
                            Ext.Msg.alert({title: "提示", msg: "登录失败，账号或密码错误", buttons: Ext.Msg.OK, fn: "", icon: Ext.Msg.ERROR});
                        default :
                            break;
                    }
                },
                failure: function (_form, action) {
                    Ext.Msg.alert({title: "提示", msg: "服务器端异常，请联系管理员", buttons: Ext.Msg.OK, fn: "", icon: Ext.Msg.ERROR});
                }
            });
        }
    }
});
