Ext.define('Admin.view.serial.SerialController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.serial',

    model: 'serial',

    control: {
        'serial-mgrid': {
            selectionchange: 'onSelectionChange'
        },
        'serial-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'serial-mgrid button[action=save]': {
            click: 'onBtnClicked'
        },
        'serial-mgrid button[action=remove]': {
            click: 'onRemoveBtnClicked'
        },
        'serial-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // news
            viewModel = ctrl.getViewModel() || {};

        var newsGrid = view.down('serial-mgrid'),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        newsGrid.down('button[action=save]').setDisabled(count != 1);
        newsGrid.down('button[action=remove]').setDisabled(count < 1);
    },

    /* 添加 */
    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('serial-mform');

        if (!win) {
            win = Ext.create({
                reference: 'serial-mform',
                xtype: 'serial-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');

        win.show();
    },

    /* 删除 */
    onRemoveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        var account = _am.currentUser.account;
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/serial/serialBtn?' + button.action + '&account=' + account
        });
    },

    /* 保存 */
    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        var account = _am.currentUser.account;

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: '/cn/serial/serialBtn?' + button.action + '&account=' + account
        });
    },

    /*提交*/
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),
            form = view.down('form').getForm();

        if (form.isValid()){
            form.submit({
                url: '/cn/serial/createSerial',
                method: 'POST',
                waitMsg: '正在提交中，请等待片刻...',
                submitEmptyText: false,
                success: function (_from, action) {
                    var success = action.result.success;
                    if (success) {
                        view.hide();
                        Ext.MessageBox.show({
                            title: '操作提示',
                            closable: 'true',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            message: '连载新增成功',
                            fn: function () {
                                var store = view.up().down('serial-mgrid').getStore();
                                store.getProxy().setExtraParam('page', 1);
                                store.reload();
                                form.reset();
                            }
                        });
                    }
                }

            });
        }
    }

});