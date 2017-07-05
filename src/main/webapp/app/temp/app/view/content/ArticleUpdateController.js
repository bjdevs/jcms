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
        var ctrl = this,
            view = ctrl.getView(), // "main-panel-article"

            cancelBtn = view.down('button[action=cancel]'),
            saveBtn = view.down('button[action=save]'),
            updateBtn = view.down('button[action=update]'),

            formPanel = view.down('form'),
            basicForm = formPanel.getForm(); // basic-form

        cancelBtn.setHidden(false);
        saveBtn.setHidden(false);
        updateBtn.setHidden(true);

        formPanel.down('#display-field').setHidden(true);
        formPanel.down('#submit-field').setHidden(false);

        KindEditor('#' + basicForm.findField('content').id).show();

        // basicForm.findField('content').setHeight(480);
        basicForm.findField('content').setHeight(basicForm.findField('content').getHeight());
    },

    /* 取消修改 */
    onCancelBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(), // "main-panel-article"

            cancelBtn = view.down('button[action=cancel]'),
            saveBtn = view.down('button[action=save]'),
            updateBtn = view.down('button[action=update]'),

            formPanel = view.down('form'),
            basicForm = formPanel.getForm(); // basic-form

        cancelBtn.setHidden(true);
        saveBtn.setHidden(true);
        updateBtn.setHidden(false);

        formPanel.down('#display-field').setHidden(false);
        formPanel.down('#submit-field').setHidden(true);
        KindEditor('#' + basicForm.findField('content').id).hide();

        // basicForm.findField('content').setHeight(480);
        basicForm.findField('content').setHeight(basicForm.findField('content').getHeight());
    },

    /* 保存 */
    onSaveBtnClicked: function (button) {
        var form = button.up().up(),
            ctrl = this,
            view = ctrl.getView(),
            formPanel = view.down('form'),
            basicForm = formPanel.getForm();
        var cancelBtn = view.down('button[action=cancel]'),
            saveBtn = view.down('button[action=save]'),
            updateBtn = view.down('button[action=update]');

        var id = form.query('[name=id]')[0].value;
        var title = form.query('[name=title]')[0].value;
        var author = form.query('[name=author]')[0].value;
        var depict = form.query('[name=depict]')[0].value;
        var kIds = form.query('[name=kId]')[0].value;
        var sIds = form.query('[name=sId]')[0].value;
        var content = basicForm.findField('content').getValue();
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
                sIds: sIds,
                content: content,
                account: account
            },
            waitMsg: '正在修改中，请稍候...',
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                var cName = data.cName;
                var sName = data.sName;
                var success = data.success;
                var result = data.result;
                if (success) {
                    if (result == "noRight") {
                        Ext.ux.Msg.error('文章修改失败，您没有该操作权限。', function () {
                        });
                    } else {
                        Ext.ux.Msg.info('文章已修改', function () {
                        });
                        form.query('[itemId=dis_content]')[0].setValue(content);
                        form.query('[itemId=cName]')[0].setValue(cName);
                        form.query('[itemId=sName]')[0].setValue(sName);
                    }
                } else {
                    Ext.ux.Msg.error('文章修改异常，请刷新页面稍后再试...', function () {
                    });
                }
                // var panel = button.up().up();
                /*var grid = button.up().up().up().down('content-mgrid');
                if (grid == null) {
                    grid = button.up().up().up().down('workbench-mgrid');
                }*/
                var grid = view.up('contentPanel').getComponent('main-panel-'+id);
                if (grid == null) {
                    // grid = view.up('contentPanel').getComponent('workbench-mgrid');
                    grid = view.up('contentPanel').getComponent('workbench').down('workbench-mgrid');
                } else {
                    grid = grid.down('grid');
                }

                // 关闭tab
                // var contentPanel = button.up().up().up();
                // contentPanel.remove(panel, true);

                // form.query('[itemId=dis_content]')[0].setValue(content);
                // form.query('[itemId=cName]')[0].setValue(cName);

                cancelBtn.setHidden(true);
                saveBtn.setHidden(true);
                updateBtn.setHidden(false);

                formPanel.down('#display-field').setHidden(false);
                formPanel.down('#submit-field').setHidden(true);
                KindEditor('#' + basicForm.findField('content').id).hide();

                basicForm.findField('content').setHeight(basicForm.findField('content').getHeight());

                grid.getStore().reload();
                grid.getSelectionModel().deselectAll();
            }
        });
    },

    onCloseBtnClicked: function (button) {
        var ctrl = this;
        var view = ctrl.getView();
        var id = location.hash;
        if (id.indexOf('#') > -1){
            id = id.substring(1, id.length);
        }
        var grid = view.up('contentPanel').getComponent('main-panel-'+id);
        if (grid == null) {
            // grid = view.up('contentPanel').getComponent('workbench-mgrid');
            grid = view.up('contentPanel').getComponent('workbench').down('workbench-mgrid');
        } else {
            grid = grid.down('grid');
        }
        grid.getStore().reload();
        grid.getSelectionModel().deselectAll();
        var panel = button.up().up();
        var contentPanel = button.up().up().up();
        contentPanel.remove(panel, true);
    }

});