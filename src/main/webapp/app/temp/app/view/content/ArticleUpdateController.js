Ext.define('Admin.view.content.ArticleUpdateController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.main-panel-article',

    control: {
        'main-panel-article button[action=update]': {
            click: 'onUpdateBtnClicked'
        },
        'main-panel-article button[action=cancel]': {
            click: 'onCancelBtnClicked'
        },
        'main-panel-article button[action=save]': {
            click: 'onSaveBtnClicked'
        }
    },

    /* 修改按钮 */
    onUpdateBtnClicked: function (button) {
        var formPanel = button.up().up();
        var displayFields = formPanel.query('[itemId^="d-"]');
        var submitFields = formPanel.query('[itemId^="v-"]');
        var cancelBtn = formPanel.down('button[action=cancel]');
        var saveBtn = formPanel.down('button[action=save]');
        var updateBtn = formPanel.down('button[action=update]');

        Ext.each(displayFields, function (item, index, allItems) {
            item.setHidden(true);
        });
        Ext.each(submitFields, function (item, index, allItems) {
            item.setHidden(false);
        });

        cancelBtn.setHidden(false);
        saveBtn.setHidden(false);
        updateBtn.setHidden(true);

        var panel = formPanel.up().down('main-panel-article');
        // 解决显示没有效果的问题
        panel.setHeight(panel.getHeight());

    },

    /* 取消修改 */
    onCancelBtnClicked: function (button) {
        var formPanel = button.up().up();
        var displayFields = formPanel.query('[itemId^="d-"]');
        var submitFields = formPanel.query('[itemId^="v-"]');
        var cancelBtn = formPanel.down('button[action=cancel]');
        var saveBtn = formPanel.down('button[action=save]');
        // var updateBtn = formPanel.down('button[action=update]');

        Ext.each(displayFields, function (item, index, allItems) {
            item.setHidden(false);
        });
        Ext.each(submitFields, function (item, index, allItems) {
            item.setHidden(true);
        });

        cancelBtn.setHidden(true);
        saveBtn.setHidden(true);
        // updateBtn.setHidden(false);

        var panel = formPanel.up().down('main-panel-article');
        // 解决显示没有效果的问题
        panel.setHeight(panel.getHeight());
    },

    /* 保存 */
    onSaveBtnClicked: function (button) {
        var form = button.up().up();

        var id = form.query('[name=id]')[0].value;
        id = id.split("：")[1];
        var title = form.query('[name=title]')[0].value;
        var author = form.query('[name=author]')[0].value;
        var depict = form.query('[name=depict]')[0].value;
        var kIds = form.query('[name=kId]')[0].value;
        var content = editor.html();
        var account = _am.currentUser.account;

        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/updateArticle',
            params: {
                id: id,
                title: title,
                author: author,
                depict: depict,
                kIds: kIds,
                content: content,
                account: account
            },
            waitMsg: '正在修改中，请稍候...',
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                if (data.success) {
                    Ext.ux.Msg.info('文章已修改', function () {
                    });
                } else {
                    Ext.ux.Msg.info('文章修改异常，请刷新页面稍后再试...', function () {
                    });
                }
                var panel = button.up().up();
                var grid = button.up().up().up().down('content-mgrid');
                console.log("grid: "+grid);
                if (grid == null){
                    grid = button.up().up().up().down('workbench-mgrid');
                    console.log("grid2: "+grid);
                }
                var contentPanel = button.up().up().up();

                var cancelBtn = panel.down('button[action=cancel]');
                var saveBtn = panel.down('button[action=save]');
                cancelBtn.setHidden(true);
                saveBtn.setHidden(true);
                contentPanel.remove(panel, true);
                grid.getStore().reload();
                grid.getSelectionModel().deselectAll();
            }
        });
    },

    onCloseBtnClicked: function (button) {
        var panel = button.up().up();
        var contentPanel = button.up().up().up();
        contentPanel.remove(panel, true);
        console.log("close");
    }

});