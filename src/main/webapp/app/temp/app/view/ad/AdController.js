Ext.define('Admin.view.ad.AdController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.ad',

    module: 'ad',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'ad-mgrid': {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        },
        'ad-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'ad-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'ad-mgrid button[action=delete]': {
            click: 'onDeleteBtnClicked'
        },
        'ad-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'ad-mgrid button[action=enabled]': {
            click: 'onEnabledBtnClicked'
        },
        'ad-mgrid button[action=abandon]': {
            click: 'onAbandonBtnClicked'
        },
        'ad-mgrid button[action=edit]': {
            click: 'onEditBtnClicked'
        },
        'ad-mgrid button[action=publish]': {
            click: 'onPublishBtnClicked'
        },
        'ad-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'ad-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // media
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            adGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        var deleteStatus = true,
            enabledStatus = false,
            abandonStatus = false,
            publishStatus = true;

        // 删除0 -> 废弃1 -> 待审2 -> 已审3 -> 已发9
        for (var i = 0; i < selected.length; i++) {
            var status = selected[i].data.status;
            if (status == GENERAL_ID_ONE) {
                deleteStatus = false;
                abandonStatus = true;
            } else if (status == GENERAL_ID_THREE){
                enabledStatus = true;
                publishStatus = false;
            } else if (status == GENERAL_ID_NINE){
                enabledStatus = true;
            }
        }
        adGrid.down('button[action=save]').setDisabled(count < 1);
        adGrid.down('button[action=delete]').setDisabled(deleteStatus);
        adGrid.down('button[action=enabled]').setDisabled(enabledStatus);
        adGrid.down('button[action=abandon]').setDisabled(abandonStatus);
        adGrid.down('button[action=publish]').setDisabled(publishStatus);
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

                var win = ctrl.lookupReference('ad-mform');

                if (!win) {
                    win = Ext.create({
                        reference: 'ad-mform',
                        xtype: 'ad-mform'
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

    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('ad-mform');

        if (!win) {
            win = Ext.create({
                reference: 'ad-mform',
                xtype: 'ad-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');

        var formPanel = win,
            displayFields = formPanel.query('[itemId^="d-"]');

        Ext.each(displayFields, function (item, index, allItems) {
            item.enable();
            item.setHidden(false);
        });
        win.show();
    },

    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up("grid");

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: '/cn/admin/adUpdate'
        });
    },

    // 删除
    onDeleteBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/adDelete'
        });
    },

    // 已审
    onEnabledBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/adEnabled'
        });
    },

    // 废弃
    onAbandonBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/adAbandon'
        });
    },

    // 已删
    onPublishBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/adPublish'
        });
    },

    onEditBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),
            grid = button.up("grid");

        var win = ctrl.lookupReference('ad-mform');

        if (!win) {
            win = Ext.create({
                reference: 'ad-mform',
                xtype: 'ad-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');

        win.show();
        var record = grid.getSelection()[0];
        win.down('form').getForm().loadRecord(record);

        var formPanel = view.down('form'),
            displayFields = formPanel.query('[itemId^="d-"]'),
            resetButton = view.down('button[action="reset"]'),
            submitButton = view.down('button[action="submit"]');

        Ext.each(displayFields, function (item, index, allItems) {
            item.disable();
            item.setHidden(true);
        });

        resetButton.setHidden(false);
        submitButton.setHidden(false);
    },

    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var form = view.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: "/cn/admin/adCreate",
                method: "POST",
                submitEmptyText: false,
                waitMsg: '上传中，稍等片刻...',
                success: function (_form, action) {
                    var result = action.result.result;
                    switch (result) {
                        case 'success' :
                            Ext.Msg.alert("提示", "更新成功", function(buttonId, text, opt){
                                view.hide();
                                var grid = view.up().down('ad-mgrid'),
                                    store = grid.getStore();

                                store.getProxy().setExtraParam('page', 1);
                                store.reload();
                            }).setIcon(Ext.Msg.INFO);
                            break;
                        case 'failed' :
                            Ext.Msg.alert("更新失败", action.result.message).setIcon(Ext.Msg.WARNING);
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
    }
});
