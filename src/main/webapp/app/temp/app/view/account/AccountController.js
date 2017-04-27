Ext.define('Admin.view.account.AccountController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.account',

    module: 'account',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {},

    onEditBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var formPanel = view.down('form'),
            displayFields = formPanel.query('[itemId^="d-"]'),
            submitFields = formPanel.query('[itemId^="v-"]'),
            cancelButton = view.down('button[action="cancel"]'),
            submitButton = view.down('button[action="submit"]');

        Ext.each(displayFields, function (item, index, allItems) {
            item.setHidden(true);
        });
        Ext.each(submitFields, function (item, index, allItems) {
            item.setHidden(false);
        });

        button.setHidden(true);

        cancelButton.setHidden(false);
        submitButton.setHidden(false);
    },
    onCancelBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var formPanel = view.down('form'),
            displayFields = formPanel.query('[itemId^="d-"]'),
            submitFields = formPanel.query('[itemId^="v-"]'),
            editButton = view.down('button[action="edit"]'),
            submitButton = view.down('button[action="submit"]');


        Ext.each(displayFields, function (item, index, allItems) {
            item.setHidden(false);
        });
        Ext.each(submitFields, function (item, index, allItems) {
            item.setHidden(true);
        });

        button.setHidden(true);
        submitButton.setHidden(true);

        editButton.setHidden(false);
    },
    onEditSettingSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var form = view.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: "./userUpdate",
                method: "POST",
                submitEmptyText: false,
                success: function (_form, action) {
                    var result = action.result.result;
                    switch (result) {
                        case 'success' :
                            Ext.Msg.alert("提示", "更新成功", function(buttonId, text, opt){
                                window.location.reload();
                            }).setIcon(Ext.Msg.INFO);
                            break;
                        case 'failed' :
                            Ext.Msg.alert("警告", "更新失败").setIcon(Ext.Msg.WARNING);
                        default :
                            break;
                    }
                },
                failure: function (_form, action) {
                    Ext.Msg.alert("错误", "服务器端异常，请联系管理员").setIcon(Ext.Msg.ERROR);
                }
            });
        }
    },
    onEditPwdSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var form = view.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: "./userChangePassWord",
                method: "POST",
                submitEmptyText: false,
                success: function (_form, action) {
                    var result = action.result.result;
                    switch (result) {
                        case 'success' :
                            Ext.Msg.alert("提示", "更新成功").setIcon(Ext.Msg.INFO);
                            break;
                        case 'failed' :
                            Ext.Msg.alert("警告", "更新失败：" + action.result.password).setIcon(Ext.Msg.WARNING);
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

});
