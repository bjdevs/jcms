Ext.define('Admin.view.account.AccountController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.account',

    module: 'account',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'account-mgrid': {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        },
        'account-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'account-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'account-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'account-mgrid button[action=enabled]': {
            click: 'onEnabledBtnClicked'
        },
        'account-mgrid button[action=abandon]': {
            click: 'onAbandonBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // user
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            // accountGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        view.down('button[action=save]').setDisabled(count < 1);
        view.down('button[action=enabled]').setDisabled(count < 1);
        view.down('button[action=abandon]').setDisabled(count < 1);
    },

    onItemClick: function (grid, record, item, index, e, eOpts) {
        var ctrl = this,
            view = ctrl.getView();

        var target = e.target;
        if (!target) return;

        var action = target.getAttribute('action'),
            id = record.get('id');

        switch (action) {
            case 'preview':

                alert('【' + id + '】' + target.getAttribute('title'));

                break;
            case 'add':

                //alert('【' + id + '】' + target.getAttribute('title'));

                var win = ctrl.lookupReference('account-mform');

                if (!win) {
                    win = Ext.create({
                        reference: 'account-mform',
                        xtype: 'account-mform'
                    });

                    view.add(win);
                }
                win.setTitle('新增子栏目');
                win.show();

                var form = win.down('form').getForm();
                form.findField('parentId').setValue(id);
                form.findField('parentPath').setValue(record.get('name')).setHidden(false);

                break;
            case 'headlineText':
                alert('【' + id + '】' + target.getAttribute('title'));
                break;
            case 'picture':
                alert('【' + id + '】' + target.getAttribute('title'));
                break;
            case 'article':
                alert('【' + id + '】' + target.getAttribute('title'));
                break;
        }
    },

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
                url: "/cn/admin/userUpdate",
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
                url: "/cn/admin/userChangePassWord",
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
                            break;
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
    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('account-mform');

        if (!win) {
            win = Ext.create({
                reference: 'account-mform',
                xtype: 'account-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');
        win.show();
    },
    onAddUserSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var form = view.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: "/cn/admin/userAdd",
                method: "POST",
                submitEmptyText: false,
                success: function (_form, action) {
                    var result = action.result.result;
                    switch (result) {
                        case 'success' :
                            Ext.Msg.alert("提示", "更新成功", function(buttonId, text, opt){
                                view.hide();
                                var grid = button.up('grid'),
                                    store = button.up('grid').getStore();
                                store.getProxy().setExtraParam('page', 1);
                                store.reload();
                            }).setIcon(Ext.Msg.INFO);
                            break;
                        case 'failed' :
                            Ext.Msg.alert("警告", "更新失败：" + action.result.message).setIcon(Ext.Msg.WARNING);
                            break;
                        case 'noRight' :
                            Ext.Msg.alert("警告", "您没有权限操作 :(").setIcon(Ext.Msg.WARNING);
                            break;
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
    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up("grid");

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: '/cn/admin/accountUpdate'
        });
    },
    onEnabledBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/accountEnabled'
        });
    },
    onAbandonBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/accountAbandon'
        });
    }

});
