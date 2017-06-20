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

        var panel1 = button.up('content-index-embed-contact');

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
                var statusStr = data.status,
                    updateDate = data.updateDate;
                if (success == true) {
                    if (result == "noRight") {
                        Ext.ux.Msg.info('对不起，您没有权限执行改操作。审核失败', function () {
                        });
                    } else {
                        Ext.ux.Msg.info('审核成功', function () {
                        });
                        panel1.lookupReference('status').setHtml({
                            statusStr: ctrl.getStatus(statusStr),
                            updateDate: updateDate
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

    onClickedRelease: function (button) {
        var ctrl = this,
            panel1 = button.up('content-index-embed-contact');
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
                var statusStr = data.status,
                    updateDate = data.updateDate;
                if (success == true) {
                    if (result == "noRight") {
                        Ext.ux.Msg.info('对不起，您没有权限执行改操作。审核失败', function () {
                        });
                    } else {
                        Ext.ux.Msg.info('发布成功', function () {
                        });
                        panel1.lookupReference('status').setHtml({
                            statusStr: ctrl.getStatus(statusStr),
                            updateDate: updateDate
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
        var ctrl = this,
            grid = button.up().up().down('grid');
        var panel1 = button.up('content-index-embed-contact');

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
                var statusStr = data.status,
                    updateDate = data.updateDate;
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
                            panel1.lookupReference('status').setHtml({
                                statusStr: ctrl.getStatus(statusStr),
                                updateDate: updateDate
                            });
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
    },
    getStatus: function (status) {
        switch (status) {
            case 0:
                return '<strong style="color: #0066FF;">初稿</strong>';
            case 1:
                return '<strong style="color: black;">已签</strong>';
            case 5:
                return '<strong style="color: #FF6633;">返工</strong>';
            case 9:
                return '<strong style="color: #7DB336;">已发</strong>';
            case 10:
                return '<strong style="color: red;">已删</strong>';
        }
    }


});