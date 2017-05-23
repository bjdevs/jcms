Ext.define('Admin.view.content.recycle.RecycleController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-recycle',

    module: 'content-recycle',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'content-recycle-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'content-recycle-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },

        'content-recycle-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'content-recycle-mgrid button[action=restore]': {
            click: 'onBtnClicked'
        },
        'content-recycle-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // recycle
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            recycleGrid = view.down(module + ctrl.getSearchGridSuffix()),
            status = ctrl.lookupReference('status'),
            count = !selected ? 0 : selected.length;

        if (count == 0) {
            Ext.log('No selection');
            status.update('');
        }

        status.update('已选中<strong>' + count + '</strong>篇文章！');

        recycleGrid.down('button[action=restore]').setDisabled(count < 1);
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');


        var idArray = grid.getSelection();
        var ids = new Array();
        for (var i = 0; i < idArray.length; i++) {
            ids[i] = idArray[i].id;


            // todo edit
            ctrl.sendAjaxFromIds(button.action, button.text, grid, {
                url: '/cn/article/articleButton',
                method: 'POST',
                params: {
                    type: button.action,
                    ids: ids
                },
                waitMsg: '正在修改中，请等待片刻...',
                submitEmptyText: false,
                success: function (result, response) {
                    var data = JSON.parse(result.responseText);
                    if (data.success) {
                        Ext.MessageBox.show({
                            title: '操作提示',
                            closable: 'true',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            align: 'center',
                            message: '操作成功'
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: '操作提示',
                            closable: 'true',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            align: 'center',
                            message: '操作异常，请稍后再试...'
                        });
                    }
                    var store = grid.getStore();
                    store.getProxy().setExtraParam('page', 1);
                    store.reload();
                }
            });
        }
    }

});
