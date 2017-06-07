Ext.define('Admin.view.content.index.embed.FawuController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.content-index-embed-fawu',

    control: {
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

    onSaveBtnClicked: function (button) {
        var form = button.up().up();
        var showContent = form.query('[itemId^=d-]');
        var disContent = form.query('[itemId^=v-]');
        var cancelBtn = form.down('[action=cancel]');
        var saveBtn = form.down('[action=save]');
        var updateBtn = form.down('[action=update]');
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
        console.log(button.action);
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
                if (data.success) {
                    Ext.ux.Msg.info('发布成功', function () {
                    });
                } else {
                    Ext.ux.Msg.error('发布失败', function () {
                    });
                }
            }
        });
    }
});