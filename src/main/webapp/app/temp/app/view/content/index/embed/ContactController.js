Ext.define('Admin.view.content.index.embed.ContactController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.content-index-embed-contact',

    control: {
        'content-index-embed-contact button[action=edit]': {
            click: 'onClickedEdit'
        },
        'content-index-embed-contact button[action=audit]': {
            click: 'onAuditBtnClicked'
        },
        'content-index-embed-contact button[action=release]': {
            click: 'onClickedRelease'
        },
        'content-index-embed-contact button[action=refresh]': {
            click: 'onClickedRefresh'
        }
    },

    onAuditBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        Ext.Ajax.request({
            url: '/cn/article/auditArticleForId',
            method: 'POST',
            params: {
                id: 4
            },
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                var success = data.success;
                var result = data.result;
                if (success == true) {
                    if (result == "noRight") {
                        Ext.ux.Msg.info('对不起，您没有权限执行改操作。审核失败', function () {
                        });
                    } else {
                        Ext.ux.Msg.info('审核成功', function () {
                        });
                    }
                } else if (success == "error") {
                    Ext.ux.Msg.info('审核失败，只有返工状态才可执行该操作', function () {
                    });
                } else {
                    Ext.ux.Msg.info('审核失败，' + result, function () {
                    });
                }
            }
        });
    },

    onClickedRelease: function () {
        // 联系我们
        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/create/embed',
            params: {
                id: 4
            },
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                var success = data.success;
                var result = data.result;
                if (success == true) {
                    if (result == "noRight") {
                        Ext.ux.Msg.info('对不起，您没有权限执行改操作。审核失败', function () {
                        });
                    } else {
                        Ext.ux.Msg.info('发布成功', function () {
                        });
                    }
                } else if (success == "error") {
                    Ext.ux.Msg.info('发布失败，只有已签状态才可执行该操作', function () {
                    });
                } else {
                    Ext.ux.Msg.info('发布失败，' + result, function () {
                    });
                }
            }
        });
    },

    onClickedEdit: function (button) {
        var grid = button.up().up().down('grid');

        var selected = grid.getSelection();

        if (selected.length == 0) {
            return;
        }
        var contact = selected[0].data;

        Ext.Ajax.request({
            url: '/cn/article/updateContact',
            method: 'POST',
            waitMsg: '正在修改中，请等待片刻...',
            params: {
                contactId: contact.id,
                contactKey: contact.key,
                contactValue: contact.value
            },
            success: function (response, opts) {
                var data = Ext.decode(response.responseText);
                var success = data.success;
                if (success) {
                    Ext.MessageBox.show({
                        title: '操作提示',
                        closable: 'true',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        align: 'center',
                        message: '修改成功',
                        fn: function (buttonId) {
                            var store = grid.getStore();
                            store.reload();
                        }
                    });
                }
            }
        });
    },

    onClickedRefresh: function (button) {
        var grid = button.up().up().down('grid');
        var store = grid.getStore();
        store.reload();
    }


});