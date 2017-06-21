Ext.define('Admin.view.content.index.nav.NavController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-index-nav',

    module: 'content-index-nav',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        '#nav': {
            beforerender: 'onBeforeRender'
        },

        'content-index-nav button[action=audit]': {
            click: 'onBtnClicked'
        },
        'content-index-nav button[action=rework]': {
            click: 'onBtnClicked'
        },
        'content-index-nav button[action=edit]': {
            click: 'onEditBtnClicked'
        },
        'content-index-nav button[action=release]': {
            click: 'onBtnClickedRelease'
        },
        'content-index-nav button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }

    },

    /*重置*/
    onResetBtnClickedNav: function (button) {
        var id = button.up().up().up().up().id;
        id = id.split('-');
        id = id[id.length - 1];
        var type = id == 'sub' ? 'deputy' : 'main';
        var content = button.up().up().query('[name=content]')[0];
        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/resetNav',
            params: {
                type: type
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                if (data.success) {
                    content.setValue(data.nav);
                }
            }
        });
    },

    onBtnClickedRelease: function (button) {
        var type = location.hash;
        var ctrl = this;
        var panel = button.up().up('content-index-nav');
        type = type.split('-');
        type = type[type.length - 1];
        type = type == "main" ? 1 : 2;

        Ext.Ajax.request({
            url: '/cn/article/create/nav',
            method: 'POST',
            params: {
                id: type
            },
            waitMsg: '正在发布，请稍候...',
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                var success = data.success;
                var statusStr = data.status;
                var updateDate = data.updateDate;
                if (success == true) {
                    Ext.ux.Msg.info('发布成功', function () {
                    });
                    panel.lookupReference('status').setHtml({
                        statusStr: ctrl.getStatus(statusStr),
                        updateDate: updateDate
                    });
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

    onBeforeRender: function (panel, eOpts) {
        this.onRefresh(panel);
    },

    onRefreshBtnClicked: function (button) {
        var navType = location.hash.split('-'),
            navType = navType[navType.length - 1];
        var panel = button.up().up('content-index-nav');
        var tpl = panel.down("[itemId=nav]").tpl;

        Ext.Ajax.request({
            url: navType == 'main' ? '/cn/article/articleForId?id=1' : '/cn/article/articleForId?id=2'
        }).then(function (response, opts) {
                var obj = Ext.decode(response.responseText);
                tpl.overwrite(panel.down().body, obj);
            },
            function (response, opts) {
                Ext.log('server-side failure with status code ' + response.status);
            });
    },

    onRefresh: function (panel) {
        var ctrl = this,
            view = ctrl.getView(),

            navType = view.id.split('-'),
            navType = navType[navType.length - 1];
        Ext.Ajax.request({
            url: navType == 'main' ? '/cn/article/articleForId?id=1' : '/cn/article/articleForId?id=2'
        }).then(function (response, opts) {
                var obj = Ext.decode(response.responseText);
                panel.setHtml(obj);

                ctrl.lookupReference('status').setHtml({
                    statusStr: ctrl.getStatus(obj['status']),
                    updateDate: obj['updateDate']
                });

            },
            function (response, opts) {
                Ext.log('server-side failure with status code ' + response.status);
            });
    },

    onEditBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),
            navType = view.id.split('-'),
            navType = navType[navType.length - 1],
            dateTime = new Date().getTime(),

            winReference = 'content-index-nav-mform-' + navType + dateTime,
            win = ctrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                reference: winReference,
                xtype: 'content-index-nav-mform'
            });

            view.add(win);
        }

        win.setTitle('修改内嵌');

        win.show();

        // render
        var record = view.down('#nav').data,
            form = win.down('form').getForm();

        var content = record['content'].replace(/,/g, "\n");

        form.findField('id').setValue(record['id']);
        form.findField('content').setValue(content);
    },

    /**
     * 审核导航
     * @param button
     */
    onBtnClicked: function (button) {
        var ctrl = this,
            panel = button.up().up('content-index-nav'),
            grid = button.up('grid');

        var type = location.hash;
        type = type.split('-');
        type = type[type.length - 1];
        type = type == "main" ? 1 : 2;
        Ext.Ajax.request({
            url: '/cn/article/auditArticleForId',
            method: 'POST',
            params: {
                id: type
            },
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                var success = data.success;
                var statusStr = data.status;
                var updateDate = data.updateDate;
                if (success == true) {
                    Ext.ux.Msg.info('审核成功', function () {
                    });
                    panel.down('[itemId=status]').setHtml({
                        statusStr: ctrl.getStatus(statusStr),
                        updateDate: updateDate
                    });
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
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();// nav
        var navType = location.hash.split('-'),
            navType = navType[navType.length - 1];
        var panel = button.up().up().up('content-index-nav');
        var panel1 = button.up().up().up('content-index-nav').down();
        var tpl = panel.down("[itemId=nav]").tpl;
        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: '/cn/article/updateArticleForId'
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {
                view.hide();
                Ext.Ajax.request({
                    url: navType == 'main' ? '/cn/article/articleForId?id=1' : '/cn/article/articleForId?id=2'
                }).then(function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        var statusStr = obj['status'];
                        var updateDate = obj['updateDate'];
                        panel.lookupReference('status').setHtml({
                            statusStr: ctrl.getStatus(statusStr),
                            updateDate: updateDate
                        });
                        button.up().up().up('content-index-nav').down('#nav').setData(obj);
                        tpl.overwrite(panel1.body, obj);
                    },
                    function (response, opts) {
                        Ext.log('server-side failure with status code ' + response.status);
                    });
            });
        });
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
