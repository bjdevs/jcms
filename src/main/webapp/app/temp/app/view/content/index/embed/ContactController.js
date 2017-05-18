Ext.define('Admin.view.content.index.embed.ContactController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.content-index-embed-contact',

    control: {
        'content-index-embed-contact button[action=edit]': {
            click: 'onClickedEdit'
        },
        'content-index-embed-contact button[action=release]': {
            click: 'onClickedRelease'
        },
        'content-index-embed-contact button[action=refresh]': {
            click: 'onClickedRefresh'
        }
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