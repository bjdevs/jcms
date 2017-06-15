Ext.define('Admin.view.content.index.embed.FawuController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.content-index-embed-fawu',

    control: {
        'content-index-embed-fawu button[action=audit]': {
            click: 'onAuditBtnClicked'
        },
        'content-index-embed-fawu button[action=update]': {
            click: 'onUpdateBtnClicked'
        },
        'content-index-embed-fawu button[action=cancel]': {
            click: 'onCancelBtnClicked'
        },
        'content-index-embed-fawu button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'content-index-embed-fawu button[action=release]': {
            click: 'onReleaseBtnClicked'
        }
    },

    onAuditBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');
        var type = location.hash;
        type = type.split('-');
        type = type[type.length - 1];
        var id = 0;
        // short
        switch (type) {
            case "short":
                id = 5;
                break;
            case "temple":
                id = 6;
                break;
            case "buddha":
                id = 7;
                break;
        }
        Ext.Ajax.request({
            url: '/cn/article/auditArticleForId',
            method: 'POST',
            params: {
                id: id
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

    onSaveBtnClicked: function (button) {
        var form = button.up().up();
        var showContent = form.query('[itemId^=d-]');
        var disContent = form.query('[itemId^=v-]');
        var cancelBtn = form.down('[action=cancel]');
        var saveBtn = form.down('[action=save]');
        var updateBtn = form.down('[action=update]');
        var releaseBtn = form.down('[action=release]');

        var type = location.hash.split('-'),
            type = type[type.length - 1];
        switch (type) {
            case "short": // 短期出家
                type = 5;
                break;
            case "temple": // 入寺须知
                type = 6;
                break;
            case "buddha": // 礼佛须知
                type = 7;
                break;
        }
        var content = form.query('[name=content]')[1].value;

        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/updateEmbedForId',
            params: {
                id: type,
                content: content
            },
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                if (data.success) {
                    Ext.ux.Msg.info('修改成功', function () {
                    });
                } else {
                    Ext.ux.Msg.error('修改失败', function () {
                    });
                }
            }
        });

        Ext.each(showContent, function (item, index, allItems) {
            item.setHidden(false);
        });

        Ext.each(disContent, function (item, index, allItems) {
            item.setHidden(true);
        });

        form.query('[name=content]')[0].setValue(content);
        cancelBtn.setHidden(true);
        saveBtn.setHidden(true);
        updateBtn.setHidden(false);

        releaseBtn.setDisabled(false);
    },

    onUpdateBtnClicked: function (button) {
        var form = button.up().up();
        var showContent = form.query('[itemId^=d-]');
        var disContent = form.query('[itemId^=v-]');
        var cancelBtn = form.down('[action=cancel]');
        var saveBtn = form.down('[action=save]');
        var updateBtn = form.down('[action=update]');
        var releaseBtn = form.down('[action=release]');

        Ext.each(showContent, function (item, index, allItems) {
            item.setHidden(true);
        });

        Ext.each(disContent, function (item, index, allItems) {
            item.setHidden(false);
        });

        cancelBtn.setHidden(false);
        saveBtn.setHidden(false);
        updateBtn.setHidden(true);
        releaseBtn.setDisabled(true);
    },

    onCancelBtnClicked: function (button) {
        var form = button.up().up();
        var showContent = form.query('[itemId^=d-]');
        var disContent = form.query('[itemId^=v-]');
        var cancelBtn = form.down('[action=cancel]');
        var saveBtn = form.down('[action=save]');
        var updateBtn = form.down('[action=update]');
        var releaseBtn = form.down('[action=release]');

        Ext.each(showContent, function (item, index, allItems) {
            item.setHidden(false);
        });

        Ext.each(disContent, function (item, index, allItems) {
            item.setHidden(true);
        });

        cancelBtn.setHidden(true);
        saveBtn.setHidden(true);
        updateBtn.setHidden(false);
        releaseBtn.setDisabled(false);
    },

    onReleaseBtnClicked: function (button) {
        var type = location.hash.split('-'),
            type = type[type.length - 1];
        switch (type) {
            case "short": // 短期出家
                type = 5;
                break;
            case "temple": // 入寺须知
                type = 6;
                break;
            case "buddha": // 礼佛须知
                type = 7;
                break;
        }
        var ids = [type];
        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/articleButton',
            params: {
                type: 'release',
                ids: ids
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
                    Ext.ux.Msg.info('发布失败，只有审核状态才可执行该操作', function () {
                    });
                } else {
                    Ext.ux.Msg.info('发布失败，' + result, function () {
                    });
                }
            }
        });
    }
});