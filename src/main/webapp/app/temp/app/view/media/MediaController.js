Ext.define('Admin.view.media.MediaController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.media',

    module: 'media',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'media-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'media-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },
        'media-mgrid': {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        },
        'media-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'media-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'media-mgrid button[action=delete]': {
            click: 'onDeleteBtnClicked'
        },
        'media-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'media-mgrid button[action=enabled]': {
            click: 'onEnabledBtnClicked'
        },
        'media-mgrid button[action=abandon]': {
            click: 'onAbandonBtnClicked'
        },
        'media-mgrid button[action=edit]': {
            click: 'onEditBtnClicked'
        }

    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // media
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            mediaGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        var deleteStatus = false,
            enabledStatus = false;
        for (var i = 0; i < selected.length; i++) {
            var status = selected[i].data.status;
            if (status == 1) { // status -> on
                deleteStatus = true;
                enabledStatus = true;
            }
        }

        mediaGrid.down('button[action=save]').setDisabled(count < 1);
        mediaGrid.down('button[action=edit]').setDisabled(count < 1);
        mediaGrid.down('button[action=enabled]').setDisabled(enabledStatus);
        mediaGrid.down('button[action=abandon]').setDisabled(count < 1);
        mediaGrid.down('button[action=delete]').setDisabled(deleteStatus);
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

                var win = ctrl.lookupReference('media-mform');

                if (!win) {
                    win = Ext.create({
                        reference: 'media-mform',
                        xtype: 'media-mform'
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

        var win = ctrl.lookupReference('media-mform');

        if (!win) {
            win = Ext.create({
                reference: 'media-mform',
                xtype: 'media-mform'
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
            url: '/cn/admin/mediaUpdate'
        });
    },

    onDeleteBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/mediaDelete'
        });
    },

    onEnabledBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/mediaEnabled'
        });
    },
    onAbandonBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/mediaAbandon'
        });
    },
    onEditBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),
            grid = button.up("grid");

        var win = ctrl.lookupReference('media-mform');

        if (!win) {
            win = Ext.create({
                reference: 'media-mform',
                xtype: 'media-mform'
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
                url: "/cn/admin/mediaCreate",
                method: "POST",
                submitEmptyText: false,
                waitMsg: '上传中，稍等片刻...',
                success: function (_form, action) {
                    var result = action.result.result;
                    switch (result) {
                        case 'success' :
                            Ext.Msg.alert("提示", "更新成功", function(buttonId, text, opt){
                                view.hide();
                                var grid = view.up().down('media-mgrid'),
                                    store = grid.getStore();

                                store.getProxy().setExtraParam('page', 1);
                                store.reload();
                            }).setIcon(Ext.Msg.INFO);
                            break;
                        case 'failed' :
                            Ext.Msg.alert("更新失败", action.result.message).setIcon(Ext.Msg.WARNING);
                        case 'noRight' :
                            Ext.Msg.alert("警告", "您没有权限操作 :(").setIcon(Ext.Msg.WARNING);
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
